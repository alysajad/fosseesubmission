import json
from django.contrib import messages
from django.db.models import Q
from django.forms import inlineformset_factory, model_to_dict
from django.http import JsonResponse, Http404, HttpResponseForbidden
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import datetime
import os

from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.utils import timezone

from .forms import (
    UserRegistrationForm, UserLoginForm,
    ProfileForm, WorkshopForm, CommentsForm, WorkshopTypeForm
)
from .models import (
    Profile, User,
    Workshop, Comment,
    WorkshopType, AttachmentFile
)
from .send_mails import send_email

__author__ = "Akshen Doke"
__credits__ = ["Mahesh Gudi", "Aditya P.", "Ankit Javalkar",
               "Prathamesh Salunke", "Kiran Kishore",
               "KhushalSingh Rajput", "Prabhu Ramachandran",
               "Arun KP"]


def _user_json(user):
    """Return user info as dict."""
    if not user.is_authenticated:
        return None
    return {
        'username': user.username,
        'firstName': user.first_name,
        'lastName': user.last_name,
        'fullName': user.get_full_name() or user.username,
        'email': user.email,
        'position': user.profile.position if hasattr(user, 'profile') else None,
    }


def _form_errors_json(form):
    """Return form errors as dict."""
    return {field: list(errors) for field, errors in form.errors.items()}


def _form_choices_json(form, field_names):
    """Extract choices from form fields."""
    choices = {}
    for name in field_names:
        field = form.fields.get(name)
        if field and hasattr(field, 'choices'):
            choices[name] = [[str(k), str(v)] for k, v in field.choices]
    return choices


def _workshop_json(ws):
    """Return workshop data as dict."""
    return {
        'id': ws.id,
        'workshopType': ws.workshop_type.name if ws.workshop_type else '',
        'date': str(ws.date) if ws.date else '',
        'status': ws.status,
        'statusDisplay': ws.get_status_display() if hasattr(ws, 'get_status_display') else str(ws.status),
        'coordinatorName': ws.coordinator.get_full_name() if ws.coordinator else '',
        'coordinatorId': ws.coordinator_id,
        'coordinatorInstitute': ws.coordinator.profile.institute if ws.coordinator and hasattr(ws.coordinator, 'profile') else '',
        'instructorName': ws.instructor.get_full_name() if ws.instructor else '',
    }


def is_email_checked(user):
    return user.profile.is_email_verified


def is_instructor(user):
    """Check if the user is having instructor rights"""
    return user.groups.filter(name='instructor').exists()


@ensure_csrf_cookie
def index(request):
    """Landing Page"""
    user = request.user
    if user.is_authenticated and is_email_checked(user):
        return JsonResponse({'user': _user_json(user), 'role': 'instructor' if is_instructor(user) else 'coordinator'})
    return JsonResponse({'user': None})


@ensure_csrf_cookie
def user_login(request):
    """User Login API"""
    user = request.user
    if user.is_authenticated:
        return JsonResponse({'success': True, 'user': _user_json(user)})

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            form = UserLoginForm(data)
        except json.JSONDecodeError:
            form = UserLoginForm(request.POST)

        if form.is_valid():
            user = form.cleaned_data
            if user.profile.is_email_verified:
                login(request, user)
                return JsonResponse({'success': True, 'user': _user_json(user)})
            else:
                return JsonResponse({'success': False, 'error': 'not_activated'})
        else:
            return JsonResponse({'success': False, 'errors': _form_errors_json(form), 'nonFieldErrors': list(form.non_field_errors())})
    else:
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


def user_logout(request):
    """Logout API"""
    logout(request)
    return JsonResponse({'success': True})


def activate_user(request, key=None):
    user = request.user
    if key is None:
        if user.is_authenticated and not user.profile.is_email_verified and \
                timezone.now() > user.profile.key_expiry_time:
            Profile.objects.get(user_id=user.profile.user_id).delete()
            User.objects.get(id=user.profile.user_id).delete()
            return JsonResponse({'status': "1"})
        elif user.is_authenticated and not user.profile.is_email_verified:
            return JsonResponse({'status': "pending"})
        elif user.is_authenticated and user.profile.is_email_verified:
            return JsonResponse({'status': "2"})
        else:
            return JsonResponse({'status': "unauthorized"}, status=401)

    user_qs = Profile.objects.filter(activation_key=key)
    if user_qs.exists():
        user_profile = user_qs.first()
    else:
        logout(request)
        return JsonResponse({'status': "invalid_key"}, status=400)

    user_profile.is_email_verified = True
    user_profile.save()
    return JsonResponse({'status': "0"})


@ensure_csrf_cookie
def user_register(request):
    """User Registration API"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            data = request.POST

        form = UserRegistrationForm(data)
        if form.is_valid():
            username, password, key = form.save()
            new_user = authenticate(username=username, password=password)
            login(request, new_user)
            user_position = request.user.profile.position
            send_email(
                request, call_on='Registration',
                user_position=user_position,
                key=key
            )
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': _form_errors_json(form)})
    else:
        form = UserRegistrationForm()
        choices = _form_choices_json(form, ['title', 'department', 'state', 'how_did_you_hear_about_us'])
        return JsonResponse({'choices': choices})


@login_required
def workshop_status_coordinator(request):
    """ Workshops proposed by Coordinator """
    user = request.user
    if is_instructor(user):
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    workshops = Workshop.objects.filter(coordinator=user.id).order_by('-date')
    return JsonResponse({
        'user': _user_json(user),
        'workshops': [_workshop_json(w) for w in workshops],
    })


@login_required
def workshop_status_instructor(request):
    """ Workshops to accept and accepted by Instructor """
    user = request.user
    if not is_instructor(user):
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    today = timezone.now().date()
    workshops = Workshop.objects.filter(Q(
        instructor=user.id,
        date__gte=today,
    ) | Q(status=0)).order_by('-date')
    return JsonResponse({
        'user': _user_json(user),
        'isInstructor': True,
        'today': str(today),
        'workshops': [_workshop_json(w) for w in workshops],
    })


@login_required
def accept_workshop(request, workshop_id):
    user = request.user
    if not is_instructor(user):
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    workshop = Workshop.objects.get(id=workshop_id)
    workshop.status = 1
    workshop.instructor = user
    workshop.save()

    coordinator_profile = workshop.coordinator.profile
    send_email(request, call_on='Booking Confirmed',
               user_position='instructor', workshop_date=str(workshop.date),
               workshop_title=workshop.workshop_type.name, user_name=workshop.coordinator.get_full_name(),
               other_email=workshop.coordinator.email, phone_number=coordinator_profile.phone_number,
               institute=coordinator_profile.institute)
    send_email(request, call_on='Booking Confirmed', workshop_date=str(workshop.date),
               workshop_title=workshop.workshop_type.name, other_email=workshop.coordinator.email,
               phone_number=request.user.profile.phone_number)
               
    return JsonResponse({'success': True})


@login_required
def reject_workshop(request, workshop_id):
    user = request.user
    if not is_instructor(user):
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    workshop = Workshop.objects.get(id=workshop_id)
    workshop.status = 2
    workshop.save()
    return JsonResponse({'success': True})


@login_required
def change_workshop_date(request, workshop_id):
    user = request.user
    if not is_instructor(user):
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except:
            data = request.POST
            
        new_date_str = data.get('new_date')
        if not new_date_str:
            return JsonResponse({'success': False, 'error': 'No date provided'})
            
        new_workshop_date = datetime.strptime(new_date_str, "%Y-%m-%d")
        today = datetime.today()
        
        if today <= new_workshop_date:
            workshop = Workshop.objects.filter(id=workshop_id)
            workshop_date = workshop.first().date
            workshop.update(date=new_workshop_date)
            
            send_email(request, call_on='Change Date', user_position='instructor',
                       workshop_date=str(workshop_date), new_workshop_date=str(new_workshop_date.date()))
            send_email(request, call_on='Change Date', new_workshop_date=str(new_workshop_date.date()),
                       workshop_date=str(workshop_date), other_email=workshop.first().coordinator.email)
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'error': 'Invalid date'})
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@login_required
def propose_workshop(request):
    user = request.user
    if is_instructor(user):
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            data = request.POST

        form = WorkshopForm(data)
        if form.is_valid():
            form_data = form.save(commit=False)
            form_data.coordinator = user
            if Workshop.objects.filter(date=form_data.date, workshop_type=form_data.workshop_type, coordinator=form_data.coordinator).exists():
                return JsonResponse({'success': False, 'error': 'Duplicate workshop'})
            else:
                form_data.save()
                instructors = Profile.objects.filter(position='instructor')
                for i in instructors:
                    send_email(request, call_on='Proposed Workshop', user_position='instructor',
                               workshop_date=str(form_data.date), workshop_title=form_data.workshop_type,
                               user_name=user.get_full_name(), other_email=i.user.email,
                               phone_number=user.profile.phone_number, institute=user.profile.institute)
                return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'errors': _form_errors_json(form)})
    
    wt_choices = [[str(wt.id), wt.name] for wt in WorkshopType.objects.all()]
    return JsonResponse({'choices': {'workshopTypes': wt_choices}})


@login_required
def workshop_type_details(request, workshop_type_id):
    user = request.user
    workshop_type = WorkshopType.objects.filter(id=workshop_type_id)
    if workshop_type.exists():
        workshop_type = workshop_type.first()
    else:
        return JsonResponse({'error': 'Not found'}, status=404)

    qs = AttachmentFile.objects.filter(workshop_type=workshop_type)

    if is_instructor(user):
        if request.method == 'POST':
            # This handles multipart forms due to file uploads
            form = WorkshopTypeForm(request.POST, instance=workshop_type)
            AttachmentFileFormSet = inlineformset_factory(WorkshopType, AttachmentFile, fields=['attachments'], can_delete=False, extra=(qs.count() + 1))
            form_file = AttachmentFileFormSet(request.POST, request.FILES, instance=form.instance)
            if form.is_valid():
                form.save()
                for file in form_file:
                    if file.is_valid() and file.clean() and file.clean().get('attachments'):
                        if file.cleaned_data.get('id'):
                            file.cleaned_data['id'].delete()
                        file.save()
                return JsonResponse({'success': True})
            return JsonResponse({'success': False, 'errors': _form_errors_json(form)})

        return JsonResponse({
            'user': _user_json(user),
            'isInstructor': True,
            'form': {
                'name': workshop_type.name,
                'description': workshop_type.description,
                'duration': workshop_type.duration,
                'terms_and_conditions': workshop_type.terms_and_conditions,
            },
            'attachments': [{'id': a.id, 'name': str(a.attachments).split('/')[-1], 'url': getattr(a.attachments, 'url', '')} for a in qs],
        })

    return JsonResponse({
        'user': _user_json(user),
        'isInstructor': False,
        'workshopType': {
            'id': workshop_type.id,
            'name': workshop_type.name,
            'description': workshop_type.description,
            'duration': workshop_type.duration,
            'terms': workshop_type.terms_and_conditions,
            'attachments': [{'id': a.id, 'name': str(a.attachments).split('/')[-1], 'url': getattr(a.attachments, 'url', '')} for a in qs],
        },
    })


@login_required
def delete_attachment_file(request, file_id):
    if not is_instructor(request.user) or request.method != 'POST':
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    file = AttachmentFile.objects.filter(id=file_id)
    if file.exists():
        file = file.first()
        if os.path.exists(file.attachments.path):
            os.remove(file.attachments.path)
        file.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'File does not exist'}, status=404)


@login_required
def workshop_type_tnc(request, workshop_type_id):
    workshop_type = WorkshopType.objects.filter(id=workshop_type_id)
    if workshop_type.exists():
        return JsonResponse({'tnc': workshop_type.first().terms_and_conditions})
    return JsonResponse({'error': 'Not found'}, status=404)


def workshop_type_list(request):
    user = request.user
    workshop_types = WorkshopType.objects.get_queryset().order_by("id")
    paginator = Paginator(workshop_types, 12)
    page = request.GET.get('page')
    workshop_type = paginator.get_page(page)

    return JsonResponse({
        'user': _user_json(user) if user.is_authenticated else None,
        'isInstructor': is_instructor(user) if user.is_authenticated else False,
        'workshopTypes': [{'id': wt.id, 'name': wt.name, 'description': wt.description, 'duration': wt.duration} for wt in workshop_type],
        'pagination': {
            'currentPage': workshop_type.number,
            'totalPages': paginator.num_pages,
            'hasPrev': workshop_type.has_previous(),
            'hasNext': workshop_type.has_next(),
        },
    })


@login_required
def workshop_details(request, workshop_id):
    workshop = Workshop.objects.filter(id=workshop_id)
    if not workshop.exists():
        return JsonResponse({'error': 'Not found'}, status=404)
    workshop = workshop.first()
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            data = request.POST
        form = CommentsForm(data)
        if form.is_valid():
            form_data = form.save(commit=False)
            if not is_instructor(request.user):
                form_data.public = True
            form_data.author = request.user
            form_data.created_date = timezone.now()
            form_data.workshop = workshop
            form_data.save()
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'errors': _form_errors_json(form)})

    workshop_comments = Comment.objects.filter(workshop=workshop) if is_instructor(request.user) else Comment.objects.filter(workshop=workshop, public=True)
    return JsonResponse({
        'user': _user_json(request.user),
        'isInstructor': is_instructor(request.user),
        'workshop': _workshop_json(workshop),
        'comments': [{
            'id': c.id,
            'author': c.author.get_full_name() or c.author.username,
            'comment': c.comment,
            'date': str(c.created_date.strftime('%b %d, %Y at %I:%M %p')) if c.created_date else '',
            'public': c.public,
        } for c in workshop_comments],
    })


@login_required
def add_workshop_type(request):
    if not is_instructor(request.user):
        return JsonResponse({'error': 'Unauthorized'}, status=403)
        
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            data = request.POST
        form = WorkshopTypeForm(data)
        if form.is_valid():
            form_data = form.save()
            return JsonResponse({'success': True, 'id': form_data.id})
        return JsonResponse({'success': False, 'errors': _form_errors_json(form)})
    return JsonResponse({'success': True})


@login_required
def view_profile(request, user_id):
    user = request.user
    if is_instructor(user) and is_email_checked(user):
        coordinator_profile = Profile.objects.get(user_id=user_id)
        workshops = Workshop.objects.filter(coordinator=user_id).order_by('date')
        return JsonResponse({
            'user': _user_json(user),
            'isInstructor': True,
            'isOwnProfile': False,
            'coordinatorProfile': {
                'fullName': coordinator_profile.user.get_full_name(),
                'email': coordinator_profile.user.email,
                'phone': coordinator_profile.phone_number,
                'institute': coordinator_profile.institute,
                'department': coordinator_profile.department,
                'location': coordinator_profile.location,
                'state': coordinator_profile.state,
            },
            'workshops': [_workshop_json(w) for w in workshops],
        })
    return JsonResponse({'error': 'Unauthorized'}, status=403)


@login_required
def view_own_profile(request):
    user = request.user
    profile = user.profile
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            data = request.POST
        form = ProfileForm(data, user=user, instance=profile)
        if form.is_valid():
            form_data = form.save(commit=False)
            form_data.user = user
            form_data.user.first_name = data.get('first_name', user.first_name)
            form_data.user.last_name = data.get('last_name', user.last_name)
            form_data.user.save()
            form_data.save()
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'errors': _form_errors_json(form)})

    form = ProfileForm(user=user, instance=profile)
    form_choices = _form_choices_json(form, ['title', 'department', 'state'])
    return JsonResponse({
        'user': _user_json(user),
        'isInstructor': is_instructor(user),
        'isOwnProfile': True,
        'profile': {
            'fullName': user.get_full_name(),
            'email': user.email,
            'phone': profile.phone_number,
            'institute': profile.institute,
            'department': profile.department,
            'location': profile.location,
            'state': profile.state,
        },
        'form': {
            'values': {
                'title': profile.title,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': profile.phone_number,
                'institute': profile.institute,
                'department': profile.department,
                'location': profile.location,
                'state': profile.state,
                'position': profile.position,
            },
            'choices': form_choices,
        },
    })

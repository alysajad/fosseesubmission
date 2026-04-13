# Python Imports
import datetime as dt
import pandas as pd

# Django Imports
from django.template.loader import get_template
from django.template import RequestContext
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils import timezone
from django.http import HttpResponse, JsonResponse

# Local Imports
from workshop_app.models import (
    Profile, User, has_profile, Workshop, WorkshopType, Testimonial,
    states
)
from teams.models import Team
from .forms import FilterForm


def is_instructor(user):
    '''Check if the user is having instructor rights'''
    return user.groups.filter(name='instructor').exists()


def is_email_checked(user):
    if hasattr(user, 'profile'):
        return user.profile.is_email_verified
    else:
        return False


def workshop_public_stats(request):
    user = request.user
    form = FilterForm()
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    state = request.GET.get('state')
    workshoptype = request.GET.get('workshop_type')
    show_workshops = request.GET.get('show_workshops')
    sort = request.GET.get('sort')
    download = request.GET.get('download')

    if from_date and to_date:
        form = FilterForm(
            start=from_date, end=to_date, state=state, type=workshoptype,
            show_workshops=show_workshops, sort=sort
        )
        workshops = Workshop.objects.filter(
            date__range=(from_date, to_date), status=1
        ).order_by(sort)
        if state:
            workshops = workshops.filter(coordinator__profile__state=state)
        if workshoptype:
            workshops = workshops.filter(workshop_type_id=workshoptype)
    else:
        today = timezone.now()
        upto = today + dt.timedelta(days=15)
        workshops = Workshop.objects.filter(
            date__range=(today, upto), status=1
            ).order_by("date")
    if show_workshops:
        if is_instructor(user):
            workshops = workshops.filter(instructor_id=user.id)
        else:
            workshops = workshops.filter(coordinator_id=user.id)
    if download:
        data = workshops.values(
            "workshop_type__name", "coordinator__first_name",
            "coordinator__last_name", "instructor__first_name",
            "instructor__last_name", "coordinator__profile__state",
            "date", "status"
        )
        df = pd.DataFrame(list(data))
        if not df.empty:
            df.status.replace(
                [0, 1, 2], ['Pending', 'Success', 'Reject'], inplace=True
            )
            codes, states_map = list(zip(*states))
            df.coordinator__profile__state.replace(
                codes, states_map, inplace=True
            )
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename=statistics.csv'
            output_file = df.to_csv(response, index=False)
            return response
        else:
            messages.add_message(request, messages.WARNING, "No data found")
    ws_states, ws_count = Workshop.objects.get_workshops_by_state(workshops)
    ws_type, ws_type_count = Workshop.objects.get_workshops_by_type(workshops)
    paginator = Paginator(workshops, 30)
    page = request.GET.get('page')
    workshops_page = paginator.get_page(page)

    import json
    userData = None
    isInst = False
    if user.is_authenticated:
        userData = {'username': user.username, 'fullName': user.get_full_name() or user.username}
        isInst = is_instructor(user)

    page_data = {
        'user': userData,
        'isInstructor': isInst,
        'ws_states': ws_states,
        'ws_count': ws_count,
        'ws_type': ws_type,
        'ws_type_count': ws_type_count,
        'workshops': [{
            'id': w.id,
            'coordinatorName': w.coordinator.get_full_name(),
            'institute': w.coordinator.profile.institute,
            'instructorName': w.instructor.get_full_name() if w.instructor else '',
            'workshopType': w.workshop_type.name,
            'date': str(w.date),
            'status': w.get_status_display()
        } for w in workshops_page],
        'pagination': {
            'currentPage': workshops_page.number,
            'totalPages': paginator.num_pages,
            'hasPrev': workshops_page.has_previous(),
            'hasNext': workshops_page.has_next(),
        }
    }

    return JsonResponse(page_data)


@login_required
def team_stats(request, team_id=None):
    user = request.user
    teams = Team.objects.all()
    if team_id:
        team = teams.get(id=team_id)
    else:
        team = teams.first()
    if not team.members.filter(user_id=user.id).exists():
        return JsonResponse({'error': 'You are not added to the team'}, status=403)

    member_workshop_data = {}
    for member in team.members.all():
        workshop_count = Workshop.objects.filter(
            instructor_id=member.user.id).count()
        member_workshop_data[member.user.get_full_name()] = workshop_count
    team_labels = list(member_workshop_data.keys())
    ws_count = list(member_workshop_data.values())
    
    import json
    page_data = {
        'user': {'username': user.username, 'fullName': user.get_full_name() or user.username},
        'isInstructor': is_instructor(user),
        'team_labels': team_labels,
        'ws_count': ws_count,
        'team_id': team.id,
        'all_teams': [{'id': t.id, 'name': str(t)} for t in teams]
    }
    
    return JsonResponse(page_data)

# Django Imports
from django.shortcuts import redirect
from django.urls import reverse
from django.conf import settings
from django.http import JsonResponse

# Local Imports
from cms.models import Page


def index(request):
    page = Page.objects.filter(title=settings.HOME_PAGE_TITLE)
    if page.exists():
        redirect_url = reverse("cms:home", args=[page.first().permalink])
    else:
        redirect_url = reverse("workshop_app:index")
    return JsonResponse({'redirect': redirect_url})

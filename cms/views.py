# Create your views here.
from django.forms import model_to_dict
from django.http import Http404, JsonResponse
from django.shortcuts import render

from cms.models import Page, Nav, SubNav


def home(request, permalink=''):
    if permalink == '':
        permalink = 'home'
    page = Page.objects.filter(permalink=permalink, active=True)
    if page.exists():
        page = page.first()
    else:
        return JsonResponse({'error': 'The requested page does not exist'}, status=404)
        
    nav_objs = Nav.objects.filter(active=True).order_by('-position')
    navs = []
    
    for nav in nav_objs:
        nav_obj = model_to_dict(nav)
        nav_obj['subnavs'] = [{'id': sn.id, 'title': sn.title, 'link': sn.link} for sn in nav.subnav_set.filter(active=True).order_by('position')]
        navs.insert(-1, nav_obj)

    return JsonResponse({
        'page': {'id': page.id, 'title': page.title, 'content': page.content, 'permalink': page.permalink},
        'navs': navs
    })

"""workshop_portal URL Configuration"""
from django.urls import re_path, include
from django.conf.urls.static import static
from django.contrib import admin
from workshop_portal import views
from django.conf import settings


urlpatterns = [
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^$', views.index),
    re_path(r'^workshop/', include('workshop_app.urls')),
    re_path(r'^reset/', include('django.contrib.auth.urls')),
    re_path(r'^page/', include('cms.urls')),
    re_path(r'^statistics/', include('statistics_app.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

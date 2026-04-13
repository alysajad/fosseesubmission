from django.urls import re_path
from django.contrib.auth.views import (
    PasswordResetView, PasswordResetConfirmView,
    PasswordResetDoneView, PasswordResetCompleteView,
    PasswordChangeView, PasswordChangeDoneView
)

urlpatterns = [
    re_path(r'^forgotpassword/$', PasswordResetView.as_view(),
        name="password_reset"),
    re_path(r'^password_reset/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$',
        PasswordResetConfirmView.as_view(),
        name='password_reset_confirm'),
    re_path(r'^password_reset/mail_sent/$', PasswordResetDoneView.as_view(),
        name='password_reset_done'),
    re_path(r'^password_reset/complete/$', PasswordResetCompleteView.as_view(),
        name='password_reset_complete'),
    re_path(r'^changepassword/$', PasswordChangeView.as_view(),
        name='password_change'),
    re_path(r'^password_change/done/$', PasswordChangeDoneView.as_view(),
        name='password_change_done'),
]

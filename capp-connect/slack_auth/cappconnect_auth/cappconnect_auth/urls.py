"""
URL configuration for cappconnect_auth project.
"""

from allauth.socialaccount.providers.slack.views import oauth2_login
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    # Use AllAuth’s Slack login view
    path("auth/login/slack/", oauth2_login, name="slack_login"),
    # AllAuth will now handle the callback internally — no need for your custom one
    path("accounts/", include("allauth.urls")),
]

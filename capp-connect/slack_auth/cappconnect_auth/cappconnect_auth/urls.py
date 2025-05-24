"""
URL configuration for cappconnect_auth project.
"""

from allauth.socialaccount.providers.slack.views import oauth2_login
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/login/slack/", oauth2_login, name="slack_login"),
    path("accounts/", include("allauth.urls")),
    path("fetch-slack/", views.fetch_slack_data, name="fetch_slack"), # added for getting old msgs and replies!
    path("", lambda request: HttpResponse("You're logged in via Slack!")),] # Temporary redirect so we know that this worked
   


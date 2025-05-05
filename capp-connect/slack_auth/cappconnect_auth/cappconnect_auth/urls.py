"""
URL configuration for cappconnect_auth project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from cappconnect_auth import views
from django.contrib import admin
from django.urls import path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/login/slack/", views.slack_login_redirect, name="slack_login"),
    path("auth/callback/slack/", views.slack_callback, name="slack_callback"),
]

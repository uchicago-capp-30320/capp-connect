"""
URL configuration for connect project.

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

from ccserver import views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path(
        "ccserver/profile/<str:username>/",
        views.GetProfile.as_view(),
        name="get_profile",
    ),  # Supports delete method
    path(
        "ccserver/profile/<str:username>/update/",
        views.GetProfile.as_view(),
        name="update_profile",
    ),
    path(
        "ccserver/profiles/",
        views.GetProfileList.as_view(),
        name="get_profile_list",
    ),
    path("ccserver/post/<int:pk>/", views.GetPost.as_view(), name="get_post"),
    path("ccserver/posts/", views.GetAllPosts.as_view(), name="get_all_posts"),
]

urlpatterns = format_suffix_patterns(urlpatterns)

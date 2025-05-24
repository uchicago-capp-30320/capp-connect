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
    path(
        "ccserver/posts/<int:pk>/", views.GetPost.as_view(), name="post_detail"
    ),
    path("ccserver/posts/", views.GetPostList.as_view(), name="all_posts"),
    path(
        "ccserver/posts/<int:pk>/comments/",
        views.GetAllComments.as_view(),
        name="get_post_comments",
    ),
    path(
        "ccserver/posts/<int:pk>/comments/<int:comment_id>/",
        views.GetComment.as_view(),
        name="delete_comment",
    ),
    path(
        "ccserver/resources/", views.GetResourceList.as_view(), name="all_resources"
    ),
    path("ccserver/resources/<int:pk>/", views.GetResource.as_view(), name="resource_detail"),
    path(
        "ccserver/posts/search/",
        views.SearchPosts.as_view(),
        name="search_posts",
    ),
    path("ccserver/tags/", views.GetTagsList.as_view(), name="get_tags"),
    path("ccserver/names/", views.GetNamesList.as_view(), name="get_names")
]

urlpatterns = format_suffix_patterns(urlpatterns)

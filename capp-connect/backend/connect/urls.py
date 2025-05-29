"""
URL configuration for CAPPConnect access. 
URL patterns given for admin, Slack authorization paths, ccserver API endpoints, and frontend URLs.
"""

import os
from pathlib import Path

from allauth.socialaccount.providers.slack.views import oauth2_login
from authentication import views as auth_views
from ccserver import views as cc_views
from ccserver.views import FrontendAppView
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve as static_serve
from rest_framework.urlpatterns import format_suffix_patterns


BASE_DIR = Path(__file__).resolve().parent.parent

urlpatterns = [
    # Admin and authentication
    path("admin/", admin.site.urls),
    path("auth/login/slack/", oauth2_login, name="slack_login"),
    path("accounts/", include("allauth.urls")),
    path(
        "fetch-slack/", auth_views.fetch_slack_data, name="fetch_slack"
    ),  # added for getting old msgs and replies!
    path("", FrontendAppView.as_view(), name="frontend"),
    # added temporarily so we know this worked
    # ccserver API endpoints
    path(
        "ccserver/profile/<str:username>/",
        cc_views.GetProfile.as_view(),
        name="get_profile",
    ),
    path(
        "ccserver/profile/<str:username>/update/",
        cc_views.GetProfile.as_view(),
        name="update_profile",
    ),
    path(
        "ccserver/profiles/",
        cc_views.GetProfileList.as_view(),
        name="get_profile_list",
    ),
    path(
        "ccserver/posts/<int:pk>/",
        cc_views.GetPost.as_view(),
        name="post_detail",
    ),
    path(
        "ccserver/profiles/search/",
        cc_views.SearchProfiles.as_view(),
        name="search_profiles",
    ),
    path("ccserver/posts/", cc_views.GetPostList.as_view(), name="all_posts"),
    path(
        "ccserver/posts/<int:pk>/comments/",
        cc_views.GetAllComments.as_view(),
        name="get_post_comments",
    ),
    path(
        "ccserver/posts/<int:pk>/comments/<int:comment_id>/",
        cc_views.GetComment.as_view(),
        name="delete_comment",
    ),
    path(
        "ccserver/resources/<int:pk>/",
        cc_views.GetResource.as_view(),
        name="resource_detail",
    ),
    path(
        "ccserver/posts/search/",
        cc_views.SearchPosts.as_view(),
        name="search_posts",
    ),
    path(
        "ccserver/tags/", cc_views.SearchOthersList.as_view(), name="tags_list"
    ),
    path(
        "ccserver/directory/",
        cc_views.SearchDirectoryList.as_view(),
        name="directory_list",
    ),
    path(
        "ccserver/resources/search/",
        cc_views.SearchResources.as_view(),
        name="search_resources",
    ),
    path(
        "ccserver/resources/",
        cc_views.GetResourceList.as_view(),
        name="resource_list",
    ),
    path("ccserver/auth/", cc_views.MyProfileView.as_view(), name="my_profile"),
    path("slack-sync/", cc_views.SlackPost.as_view(), name="slack_sync"),
]

urlpatterns = format_suffix_patterns(urlpatterns)

urlpatterns += [
    re_path(
        r"^_expo/(?P<path>.*)$",
        static_serve,
        {
            "document_root": os.path.join(BASE_DIR, "ccserver/static/_expo"),
        },
    ),
    re_path(
        r"^favicon\.ico$",
        static_serve,
        {
            "document_root": os.path.join(BASE_DIR, "ccserver/static"),
            "path": "favicon.ico",
        },
    ),
    re_path(
        r"^assets/(?P<path>.*)$",
        static_serve,
        {
            "document_root": os.path.join(BASE_DIR, "ccserver/static/assets"),
        },
    ),
    re_path(
        r"^(?!ccserver/).*$",
        FrontendAppView.as_view(),
        name="frontend-catchall",
    ),
]

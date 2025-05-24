from allauth.socialaccount.providers.slack.views import oauth2_login
from authentication import views as auth_views
from ccserver import views as cc_views
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    # Admin and authentication
    path("admin/", admin.site.urls),
    path("auth/login/slack/", oauth2_login, name="slack_login"),
    path("accounts/", include("allauth.urls")),
    path(
        "fetch-slack/", auth_views.fetch_slack_data, name="fetch_slack"
    ),  # added for getting old msgs and replies!
    path("", lambda request: HttpResponse("You're logged in via Slack!")),
    # added temporarily so we know this worked
    # ccserver API endpoints
    path(
        "ccserver/profile/<str:username>/",
        cc_views.GetProfile.as_view(),
        name="get_profile",
    ),  # Supports delete method
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
    path("ccserver/tags/", cc_views.GetTagsList.as_view(), name="get_tags"),
    path("ccserver/names/", cc_views.GetNamesList.as_view(), name="get_names"),
    path(
        "ccserver/posts/<int:pk>/",
        cc_views.GetPost.as_view(),
        name="post_detail",
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
        "ccserver/resources/",
        cc_views.GetResource.as_view(),
        name="get_resources",
    ),
    path(
        "ccserver/resources/search/",
        cc_views.SearchResources.as_view(),
        name="search_resources",
    ),
]

urlpatterns = format_suffix_patterns(urlpatterns)

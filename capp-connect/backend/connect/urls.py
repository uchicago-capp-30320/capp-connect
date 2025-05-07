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
    path("ccserver/<int:pk>/", views.GetProfile.as_view(), name="get_user"),
    path("ccserver/post/<int:pk>/", views.GetPost.as_view(), name="get_post")
    # path(
    #     "ccserver/create_content/",
    #     views.CreateContent.as_view(),
    #     name="create_content",
    # ),
    # path(
    #     "ccserver/fetch_content/",
    #     views.FetchContent.as_view(),
    #     name="fetch_content",
    # ),
    # path(
    #     "ccserver/fetch_content_info/",
    #     views.FetchContentInfo.as_view(),
    #     name="fetch_content_info",
    # ),
]

urlpatterns = format_suffix_patterns(urlpatterns)

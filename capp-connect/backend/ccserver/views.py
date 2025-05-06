from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, viewsets
from django.contrib.auth.models import User
from django.http import Http404
from rest_framework import status


# Create your views here.
from .models import (
    Event,
    EventTag,
    Post,
    PostTag,
    Project,
    ProjectTag,
    Tag,
    User,
    UserTag,
)


from serializers import (
    TagSerializer,
    UserSerializer,
    UserTagSerializer,
    PostSerializer,
    PostTagSerializer,
    EventSerializer,
    EventTagSerializer,
    ProjectSerializer,
    ProjectTagSerializer,
)

# tutorial: https://www.django-rest-framework.org/tutorial/3-class-based-views/


class GetUser(APIView):
    def get(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404

    def put(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetPost(APIView):
    def get(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            raise Http404

    def put(self, request, pk, format=None):
        post = self.get_object(pk)
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

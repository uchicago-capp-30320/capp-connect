from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Post, Profile
from .serializers import (
    PostSerializer,
    ProfileListSerializer,
    ProfileSerializer,
)


# tutorial: https://www.django-rest-framework.org/tutorial/3-class-based-views/


class GetProfile(APIView):
    def get(self, request, username, format=None):
        try:
            profile = Profile.objects.get(user__username=username)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def post(self, request, username, format=None):
        try:
            profile = Profile.objects.get(user__username=username)
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(
        self, request, username, format=None
    ):  # Missing permission check
        try:
            profile = Profile.objects.get(user__username=username)
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GetProfileList(APIView):
    def get(self, request, format=None):
        users = Profile.objects.all()
        serializer = ProfileListSerializer(users, many=True)
        return Response(serializer.data)


class GetPost(APIView):
    def get(self, request, pk, format=None):
        try:
            post = Post.objects.get(pk=pk)
            serializer = PostSerializer(post)
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, pk, format=None):
        post = self.get_object(pk)
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetAllPosts(APIView):
    def get(self, request, format=None):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

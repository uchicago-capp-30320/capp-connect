from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import (
    PostSerializer,
    ProfileSerializer,
)

# Create your views here.
from .models import Post, Profile, Tag


# tutorial: https://www.django-rest-framework.org/tutorial/3-class-based-views/


class GetProfile(APIView):
    def get(self, request, pk, format = None):
        try:
            user = Profile.objects.get(pk=pk)
            serializer = ProfileSerializer(user)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def post(self, request, format=None):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

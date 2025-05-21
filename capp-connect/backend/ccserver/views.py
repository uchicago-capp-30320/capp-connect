from django.contrib.postgres.search import SearchVector
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Comment, Post, Profile, Tag
from .serializers import (
    CommentSerializer,
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


class SearchPosts(APIView):
    def get(self, request):
        tag_names_list = request.GET.getlist("tags")
        matching_posts = None
        for tag_name in tag_names_list:
            tag_posts = Post.objects.filter(tags__tag_name=tag_name)
            if matching_posts is None:
                matching_posts = tag_posts
            else:
                # Update matching_posts to only include posts that also match previous tag(s)
                matching_posts = matching_posts.intersection(tag_posts)
        serializer = PostSerializer(matching_posts, many=True)
        return Response(serializer.data)        





class GetAllPosts(APIView):
    def get(self, request, format=None):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)


class GetComment(APIView):
    def get(self, request, pk, comment_id, format=None):
        try:
            post = Post.objects.get(pk=pk)
            comment = post.comments.get(pk=comment_id)
            serializer = CommentSerializer(comment)
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )
        except Comment.DoesNotExist:
            return Response(
                {"error": "Comment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def delete(self, request, pk, comment_id, format=None):
        try:
            post = Post.objects.get(pk=pk)
            comment = post.comments.get(pk=comment_id)
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )
        except Comment.DoesNotExist:
            return Response(
                {"error": "Comment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )


class GetAllComments(APIView):
    def get(self, request, pk, format=None):
        try:
            post = Post.objects.get(pk=pk)
            comments = post.comments.all()
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )
        except Comment.DoesNotExist:
            return Response(
                {"error": "Comment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def post(self, request, pk, format=None):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(post=post, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

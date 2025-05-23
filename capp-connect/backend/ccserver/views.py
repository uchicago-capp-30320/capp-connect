from django.core.paginator import EmptyPage, Paginator
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Comment, Post, Profile, Resource, Tag
from .serializers import (
    CommentSerializer,
    NameSerializer,
    PostSerializer,
    ProfileListSerializer,
    ProfileSerializer,
    ResourceSerializer,
    TagSerializer,
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

    def put(self, request, username, format=None):
        try:
            profile = Profile.objects.get(user__username=username)
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            if request.user == profile.user:
                serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, username, format=None):
        try:
            profile = Profile.objects.get(user__username=username)
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        if request.user == profile.user:
            profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GetProfileList(APIView):
    def get(self, request, format=None):
        users = Profile.objects.all()
        serializer = ProfileListSerializer(users, many=True)
        return Response(serializer.data)


class SearchDirectoryList(APIView):
    def get(self, request, format=None):
        users = Profile.objects.all()
        user_serializer = NameSerializer(users, many=True)
        tags = Tag.objects.filter(allowed_on_profile=True)
        tag_serializer = TagSerializer(tags, many=True)
        return Response(
            {"users": user_serializer.data, "tags": tag_serializer.data}
        )


class SearchOthersList(APIView):
    def get(self, request, format=None):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)


class SearchProfiles(APIView):
    def get(self, request):
        tag_names_list = request.GET.getlist("tags")
        matching_profiles = None

        for tag_name in tag_names_list:
            # Check for tag matches within tags or names
            tag_profiles = Profile.objects.filter(tags__tag_name=tag_name)
            name_profiles = Profile.objects.filter(slack_username=tag_name)
            tag_or_name_matches = tag_profiles.union(name_profiles)
            if matching_profiles is None:
                matching_profiles = tag_or_name_matches
            else:
                # Update matching_posts to only include profiles that also match previous tag(s)
                matching_profiles = matching_profiles.intersection(
                    tag_or_name_matches
                )
        serializer = ProfileSerializer(matching_profiles, many=True)
        return Response(serializer.data)


class GetPost(APIView):
    def get_object(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist as e:
            raise Http404(f"Post with id {pk} does not exist.") from e

    def get(self, request, pk, format=None):
        try:
            post = Post.objects.get(pk=pk)
            serializer = PostSerializer(post)
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, pk, format=None):
        post = self.get_object(pk)
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            if request.user == post.user:
                serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        post = self.get_object(pk)
        if request.user == post.user:
            post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GetPostList(APIView):
    POSTS_PER_TYPE = 25

    def get(self, request, format=None):
        page_number = request.GET.get("page", 1)
        group_data = {}
        post_types = [choice[0] for choice in Post.PostType.choices]

        for post_type in post_types:
            posts = Post.objects.filter(post_type=post_type)
            paginator = Paginator(posts, self.POSTS_PER_TYPE)

            try:
                page = paginator.page(page_number)
                serializer = PostSerializer(page.object_list, many=True)
                group_data[post_type] = serializer.data
            except EmptyPage:
                group_data[post_type] = []
        next_page = page_number + 1 if any(group_data.values()) else None

        response_data = {
            "next_page": next_page,
            "current_page": page_number,
            "posts_per_type": self.POSTS_PER_TYPE,
            "posts": group_data,
        }

        return Response(response_data)

    def post(self, request, format=None):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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
            if request.user == comment.user:
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
            post = Post.objects.all(pk=pk)
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


class GetResourceList(APIView):
    def get(self, request, format=None):
        resources = Resource.objects.all()
        serializer = ResourceSerializer(resources, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ResourceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetResource(APIView):
    def get_object(self, pk):
        try:
            return Resource.objects.get(pk=pk)
        except Resource.DoesNotExist as e:
            raise Http404(f"Post with id {pk} does not exist.") from e

    def get(self, request, pk, format=None):
        try:
            resource = Resource.objects.get(pk=pk)
            serializer = ResourceSerializer(resource)
            return Response(serializer.data)
        except Resource.DoesNotExist:
            return Response(
                {"error": "Resource not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def put(self, request, pk, format=None):
        try:
            resource = self.get_object(pk=pk)
        except Resource.DoesNotExist:
            return Response(
                {"error": "Resource not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ResourceSerializer(
            resource, data=request.data, partial=True
        )
        if serializer.is_valid():
            if request.user == resource.user:
                serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        resource = self.get_object(pk)
        if request.user == resource.user:
            resource.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SearchResources(APIView):
    def get(self, request):
        tag_names_list = request.GET.getlist("tags")
        matching_resources = None
        for tag_name in tag_names_list:
            tag_resources = Resource.objects.filter(tags__tag_name=tag_name)
            if matching_resources is None:
                matching_resources = tag_resources
            else:
                # Update matching_posts to only include posts that also match previous tag(s)
                matching_resources = matching_resources.intersection(
                    tag_resources
                )
        serializer = PostSerializer(matching_resources, many=True)
        return Response(serializer.data)


class MyProfileView(APIView):
    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

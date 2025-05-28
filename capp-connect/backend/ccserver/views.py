from django.core.paginator import EmptyPage, Paginator
from django.http import Http404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView
from rest_framework import status
from rest_framework.authentication import TokenAuthentication  # For Slack Posts
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
    """API endpoint for retrieving, updating, or deleting a specific user profile.
    
    Supports GET, PUT, and DELETE operations for individual profiles.
    Access control ensures users can only modify their own profile.
    """
    def get(self, request, username, format=None):
        """Retrieve a profile by username.
        
        Args:
            request: HTTP request object
            username: Target profile's username
            format: Optional format suffix

        Returns:
            Response: Serialized profile data or 404 error
        """
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
        """Update a profile by username (partial updates allowed).
        
        Args:
            request: HTTP request object with updated profile data
            username: Target profile's username
            format: Optional format suffix

        Returns:
            Response: Updated profile data, 404 if not found, 
                      400 for invalid data, or 403 for permission denied
        """
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
        """Delete a profile by username.
        
        Args:
            request: HTTP request object
            username: Target profile's username
            format: Optional format suffix

        Returns:
            Response: 204 on success, 404 if not found, or 403 for permission denied
        """
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
        else:
            return Response(
                {"error": "You do not have permission to delete this profile."},
                status=status.HTTP_403_FORBIDDEN,
            )


class GetProfileList(APIView):
    """API endpoint for listing all user profiles with compact information."""
    def get(self, request, format=None):
        """Retrieve all profiles.
        
        Args:
            request: HTTP request object
            format: Optional format suffix

        Returns:
            Response: List of serialized profile summaries
        """
        users = Profile.objects.all()
        serializer = ProfileListSerializer(users, many=True)
        return Response(serializer.data)


class SearchDirectoryList(APIView):
    """API endpoint for directory search data (usernames and allowed tags)."""
    def get(self, request, format=None):
        """Retrieve searchable directory data.
        
        Args:
            request: HTTP request object
            format: Optional format suffix

        Returns:
            Response: Dictionary containing:
                - users: List of cleaned usernames
                - tags: List of tags allowed for profiles
        """
        users = Profile.objects.all()
        user_serializer = NameSerializer(users, many=True)
        tags = Tag.objects.filter(allowed_on_profile=True)
        tag_serializer = TagSerializer(tags, many=True)
        return Response(
            {"users": user_serializer.data, "tags": tag_serializer.data}
        )


class SearchOthersList(APIView):
    """API endpoint for retrieving all available tags."""
    def get(self, request, format=None):
        """Retrieve all tags. For searching feed posts and resources.
        
        Args:
            request: HTTP request object
            format: Optional format suffix

        Returns:
            Response: List of serialized tags
        """
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)


class SearchProfiles(APIView):
    """API endpoint for searching profiles by tags or usernames."""
    def get(self, request):
        """Search profiles by tags (intersection of all provided tags).
        
        Args:
            request: HTTP request object with 'tags' query parameter(s)

        Returns:
            Response: List of profiles matching all provided tags
        """
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
    """API endpoint for retrieving, updating, or deleting a specific post."""
    def get_object(self, pk):
        """Helper method to retrieve a post by primary key.
        
        Args:
            pk: Post primary key
            
        Returns:
            Post: Retrieved post object
            
        Raises:
            Http404: If post does not exist
        """
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist as e:
            raise Http404(f"Post with id {pk} does not exist.") from e

    def get(self, request, pk, format=None):
        """Retrieve a post by ID.
        
        Args:
            request: HTTP request object
            pk: Post primary key
            format: Optional format suffix

        Returns:
            Response: Serialized post data or 404 error
        """
        try:
            post = Post.objects.get(pk=pk)
            serializer = PostSerializer(post)
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, pk, format=None):
        """Update a post by ID (partial updates allowed).
        
        Args:
            request: HTTP request object with updated post data
            pk: Post primary key
            format: Optional format suffix

        Returns:
            Response: Updated post data, 404 if not found, 
                      400 for invalid data, or 403 for permission denied
        """
        post = self.get_object(pk)
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            if request.user == post.user:
                serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        """Delete a post by ID.
        
        Args:
            request: HTTP request object
            pk: Post primary key
            format: Optional format suffix

        Returns:
            Response: 204 on success or 403 for permission denied
        """
        post = self.get_object(pk)
        if request.user == post.user:
            post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GetPostList(APIView):
    """API endpoint for listing paginated posts grouped by type, 
    and creating new posts.
    """
    POSTS_PER_TYPE = 25

    def get(self, request, format=None):
        """Retrieve paginated posts grouped by post type.
        
        Args:
            request: HTTP request object with optional 'page' query parameter
            format: Optional format suffix

        Returns:
            Response: Dictionary containing:
                - next_page: Next page number (or null)
                - current_page: Current page number
                - posts_per_type: Number of posts per type per page
                - posts: Dictionary of post types with serialized post lists
        """
        try:
            page_number = int(request.GET.get("page", 1))
        except ValueError:
            page_number = 1

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
        """Create a new post.
        
        Args:
            request: HTTP request object with post data
            format: Optional format suffix

        Returns:
            Response: Serialized post data on success (201), 
                      or validation errors (400)
        """
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SearchPosts(APIView):
    """API endpoint for searching posts by tags (intersection of all tags)."""
    def get(self, request):
        """Search posts by tags (intersection of all provided tags).
        
        Args:
            request: HTTP request object with 'tags' query parameter(s)

        Returns:
            Response: List of posts matching all provided tags
        """
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
    """API endpoint for retrieving or deleting a specific comment."""
    def get(self, request, pk, comment_id, format=None):
        """Retrieve a comment by post ID and comment ID.
        
        Args:
            request: HTTP request object
            pk: Post primary key
            comment_id: Comment primary key
            format: Optional format suffix

        Returns:
            Response: Serialized comment data or 404 error
        """
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
        """Delete a comment by post ID and comment ID.
        
        Args:
            request: HTTP request object
            pk: Post primary key
            comment_id: Comment primary key
            format: Optional format suffix

        Returns:
            Response: 204 on success or 404 if not found
        """
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
    """API endpoint for listing all comments on a post or creating 
    new comments.
    """
    def get(self, request, pk, format=None):
        """Retrieve all comments for a specific post.
        
        Args:
            request: HTTP request object
            pk: Post primary key
            format: Optional format suffix

        Returns:
            Response: List of serialized comments or 404 error
        """
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
        """Create a new comment on a specific post.
        
        Args:
            request: HTTP request object with comment data
            pk: Post primary key
            format: Optional format suffix

        Returns:
            Response: Serialized comment data on success (201), 
                      404 if post not found, or 400 for invalid data
        """
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
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        resource = self.get_object(pk)
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
        serializer = ResourceSerializer(matching_resources, many=True)
        return Response(serializer.data)


class MyProfileView(APIView):
    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class SlackPost(APIView):
    authentication_classes = [TokenAuthentication]

    def get_object(self, slack_ts, post_type):
        try:
            return Post.objects.get(slack_ts=slack_ts, post_type=post_type)
        except Post.DoesNotExist:
            return None

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        slack_ts = request.data.get("slack_ts")
        post_type = request.data.get("post_type")
        post = self.get_object(slack_ts, post_type)
        if not post:
            return Response(
                {"error": "Post not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        slack_ts = request.data.get("slack_ts")
        post_type = request.data.get("post_type")
        post = self.get_object(slack_ts, post_type)
        if post:
            post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(never_cache, name="dispatch")
# We want this to always refresh for dev
class FrontendAppView(TemplateView):
    template_name = "index.html"

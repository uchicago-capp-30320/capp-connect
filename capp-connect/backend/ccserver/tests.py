from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Comment, EmploymentStatus, Post, Profile, Resource, Tag


class BaseTestCase(APITestCase):
    """Base test case with common setup for all test classes.

    Creates:
    - Two test users
    - Profile for first user
    - Sample tags
    - Sample post with tag
    - Sample resource
    - Sample comment
    - Authenticates the first user by default
    """

    def setUp(self):
        """Initialize test data and authenticate user1."""
        # Create test users
        self.user1 = User.objects.create_user(
            username="user1", password="testpass123"
        )
        self.user2 = User.objects.create_user(
            username="user2", password="testpass456"
        )

        # Create profile for user1
        self.profile1 = Profile.objects.create(
            user=self.user1,
            slack_username="test_user1",
            bio="Test bio",
            employment_status=EmploymentStatus.STUDENT,
        )

        # Create tags
        self.tag1, _ = Tag.objects.get_or_create(
            tag_name="Python", defaults={"allowed_on_profile": True}
        )
        self.tag2, _ = Tag.objects.get_or_create(
            tag_name="Django", defaults={"allowed_on_profile": True}
        )

        # Create test post
        self.post = Post.objects.create(
            user=self.user1,
            title="Test Post",
            description="Test Content",
            post_type=Post.PostType.GENERAL,
        )
        self.post.tags.add(self.tag1)

        # Create test resource
        self.resource = Resource.objects.create(
            title="Test Resource", description="Resource Content"
        )

        # Create test comment
        self.comment = Comment.objects.create(
            user=self.user1, post=self.post, comment_text="Test comment"
        )

        # Authenticate user1 by default
        self.client.force_authenticate(user=self.user1)


class ProfileTests(BaseTestCase):
    """Test suite for profile-related API endpoints."""

    def test_get_profile(self):
        """Test retrieving a profile by username returns correct data."""
        url = reverse("get_profile", kwargs={"username": "user1"})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"], "user1")

    def test_update_profile(self):
        """Test updating a profile with valid data succeeds."""
        url = reverse("get_profile", kwargs={"username": "user1"})
        data = {"bio": "Updated bio", "tags": ["Python"]}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["bio"], "Updated bio")
        self.assertEqual(len(response.data["tags"]), 1)

    def test_delete_profile(self):
        """Test authenticated user can delete their own profile."""
        url = reverse("get_profile", kwargs={"username": "user1"})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Profile.objects.filter(user=self.user1).exists())

    def test_unauthorized_profile_access(self):
        """Test users cannot delete other users' profiles."""
        self.client.force_authenticate(user=self.user2)
        url = reverse("get_profile", kwargs={"username": "user1"})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class PostTests(BaseTestCase):
    """Test suite for post-related API endpoints."""

    def test_create_post(self):
        """Test authenticated user can create a new post with tags."""
        url = reverse("all_posts")
        data = {
            "title": "New Post",
            "description": "Post content",
            "post_type": "General",
            "tags": ["Python"],
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 2)

    def test_get_post_list(self):
        """Test retrieving paginated post list returns expected structure."""
        url = reverse("all_posts")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("General", response.data["posts"])

    def test_search_posts(self):
        """Test searching posts by tag returns correct results."""
        url = reverse("search_posts") + "?tags=Python"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class CommentTests(BaseTestCase):
    """Test suite for comment-related API endpoints."""

    def test_create_comment(self):
        """Test authenticated user can create a comment on a post."""
        url = reverse("get_post_comments", kwargs={"pk": self.post.pk})
        data = {"comment_text": "New comment"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.post.comments.count(), 2)

    def test_delete_comment(self):
        """Test comment author can delete their comment."""
        url = reverse(
            "delete_comment",
            kwargs={"pk": self.post.pk, "comment_id": self.comment.pk},
        )
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.post.comments.count(), 0)


class ResourceTests(BaseTestCase):
    """Test suite for resource-related API endpoints."""

    def test_get_resource(self):
        """Test retrieving a resource by ID returns correct data."""
        url = reverse("resource_detail", kwargs={"pk": self.resource.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Test Resource")

    def test_search_resources(self):
        """Test searching resources by tag returns correct results."""
        self.resource.tags.add(self.tag1)
        url = reverse("search_resources") + "?tags=Python"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["tags"][0], "Python")


class SearchTests(BaseTestCase):
    """Test suite for search functionality."""

    def test_tag_list(self):
        """Test retrieving all tags returns expected tags."""
        url = reverse("tags_list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Python", response.data)

    def test_directory_search(self):
        """Test directory search returns users and allowed tags."""
        url = reverse("directory_list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("users", response.data)
        self.assertIn("tags", response.data)


class SlackPostTests(BaseTestCase):
    """Test suite for Slack integration endpoints."""

    def setUp(self):
        super().setUp()
        # Create and set authentication token
        self.token = Token.objects.create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

        # Sample Slack post data
        self.slack_post_data = {
            "title": "Slack Test Post",
            "description": "General from Slack",
            "post_type": "General",
            "tags": ["Python"],
            "slack_ts": "1234567890.123456",
            "slack_user_id": "U12345678",
            "client_msg_id": "1234567890.123456",
        }

    def test_create_post_via_slack(self):
        """Test successful post creation via Slack integration."""
        url = reverse("slack_sync")
        response = self.client.post(url, self.slack_post_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 2)
        post = Post.objects.get(slack_ts="1234567890.123456")
        self.assertEqual(post.description, "General from Slack")
        self.assertEqual(post.source, Post.Source.SLACK)

    def test_update_post_via_slack(self):
        """Test updating an existing Slack post."""
        # Create initial post
        self.client.post(reverse("slack_sync"), self.slack_post_data)

        # Update data
        update_data = {
            "slack_ts": "1234567890.123456",
            "post_type": "General",
            "description": "Updated description",
            "tags": ["Django"],
        }

        response = self.client.put(reverse("slack_sync"), update_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        post = Post.objects.get(slack_ts="1234567890.123456")
        self.assertEqual(post.description, "Updated description")
        self.assertEqual(post.tags.first().tag_name, "Django")

    def test_delete_post_via_slack(self):
        """Test deleting a Slack post."""
        # Create initial post
        self.client.post(reverse("slack_sync"), self.slack_post_data)
        self.assertEqual(Post.objects.count(), 2)

        # Delete request
        delete_data = {"slack_ts": "1234567890.123456", "post_type": "General"}
        response = self.client.delete(reverse("slack_sync"), delete_data)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 1)
        self.assertFalse(
            Post.objects.filter(slack_ts="1234567890.123456").exists()
        )

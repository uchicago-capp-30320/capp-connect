from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Comment, EmploymentStatus, Post, Profile, Resource, Tag


class BaseTestCase(APITestCase):
    def setUp(self):
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
    def test_get_profile(self):
        url = reverse("get_profile", kwargs={"username": "user1"})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"], "user1")

    def test_update_profile(self):
        url = reverse("get_profile", kwargs={"username": "user1"})
        data = {"bio": "Updated bio", "tags": ["Python"]}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["bio"], "Updated bio")
        self.assertEqual(len(response.data["tags"]), 1)

    def test_delete_profile(self):
        url = reverse("get_profile", kwargs={"username": "user1"})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Profile.objects.filter(user=self.user1).exists())

    def test_unauthorized_profile_access(self):
        self.client.force_authenticate(user=self.user2)
        url = reverse("get_profile", kwargs={"username": "user1"})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class PostTests(BaseTestCase):
    def test_create_post(self):
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
        url = reverse("all_posts")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("General", response.data["posts"])

    def test_search_posts(self):
        url = reverse("search_posts") + "?tags=Python"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class CommentTests(BaseTestCase):
    def test_create_comment(self):
        url = reverse("get_post_comments", kwargs={"pk": self.post.pk})
        data = {"comment_text": "New comment"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.post.comments.count(), 2)

    def test_delete_comment(self):
        url = reverse(
            "delete_comment",
            kwargs={"pk": self.post.pk, "comment_id": self.comment.pk},
        )
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.post.comments.count(), 0)


class ResourceTests(BaseTestCase):
    def test_get_resource(self):
        url = reverse("resource_detail", kwargs={"pk": self.resource.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Test Resource")
    
    def test_search_resources(self):
        self.resource.tags.add(self.tag1)
        url = reverse("search_resources") + "?tags=Python"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data["title"], "Test Resource")

class SearchTests(BaseTestCase):
    def test_tag_list(self):
        url = reverse("tags_list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Python", response.data)

    def test_directory_search(self):
        url = reverse("directory_list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("users", response.data)
        self.assertIn("tags", response.data)

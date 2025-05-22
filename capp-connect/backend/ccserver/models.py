"""
Not a best practice, we should likely have had one not two  django projects.
However, since we are where we are, it was easier and less disruptive to just
copy over the one model I needed than it was to import it from your project,
since doing so would have required messing with your imports on your app and
I don't want to touch that at all. Any changes made on ccserver/models.py Profile
need to be made at authentication/models.py as well
"""

from django.contrib.auth.models import User
from django.db import models


# Choices for model fields
class EmploymentStatus(models.TextChoices):
    EMPLOYED = "Employed", "employed"
    SEARCHING = "Searching", "searching"
    HIRING = "Hiring", "hiring"
    STUDENT = "Student", "student"


class PostType(models.TextChoices):
    JOB = "Job", "job"
    GENERAL = "General", "general"
    RESOURCE = "Resource", "resource"
    EVENT = "Event", "event"
    PROJECT = "Project", "project"


# Models
# Tags, to be used for users/posts
class Tag(models.Model):
    tag_id = models.AutoField(primary_key=True)
    tag_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.tag_name


# Users and related tables
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    slack_username = models.CharField(max_length=100, blank=True, null=True)
    slack_dm_url = models.CharField(max_length=100, blank=True, null=True)
    linkedin_url = models.CharField(max_length=100, blank=True, null=True)
    github_url = models.CharField(max_length=100, blank=True, null=True)
    personal_site = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.CharField(max_length=254, blank=True, null=True)
    photo_url = models.CharField(max_length=255, blank=True, null=True)
    employment_status = models.CharField(
        max_length=20,
        choices=EmploymentStatus.choices,
        default=EmploymentStatus.SEARCHING,
    )
    job_title = models.CharField(max_length=100, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(max_length=600, blank=True, null=True)
    tags = models.ManyToManyField(
        Tag, through="ProfileTag", related_name="user_tags"
    )

    def __str__(self):
        return f"{self.user.username}'s profile"


class ProfileTag(models.Model):
    profile = models.ForeignKey(Profile, default=1, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("profile", "tag")


# Posts and related tables
class Post(models.Model):
    class Source(models.TextChoices):
        SLACK = "Slack", "Slack"
        APP = "App", "App"

    post_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    post_type = models.CharField(
        max_length=20, choices=PostType.choices, default=PostType.GENERAL
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(
        Tag, through="PostTag", related_name="post_tags"
    )
    links = models.TextField(blank=True, null=True)
    start_time = models.DateTimeField()
    location = models.CharField(max_length=100, blank=True, null=True)
    source = models.CharField(
        max_length=5,
        choices=Source.choices,
        default=Source.APP,
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-created_at"]


class PostTag(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("post", "tag")


class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="comments"
    )
    comment_text = models.TextField(max_length=1000, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on post '{self.post.title}'"

    class Meta:
        ordering = ["-created_at"]


# Resources and related tables
class Resource(models.Model):
    resource_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    links = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-created_at"]

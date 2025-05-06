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


# Models
# Tags for users/posts/events/resources
class Tag(models.Model):
    tag_id = models.AutoField(primary_key=True)
    tag_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.tag_name


# User and related tables
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    slack_username = models.CharField(max_length=100, blank=True, null=True)
    linkedin_username = models.CharField(max_length=100, blank=True, null=True)
    github_username = models.CharField(max_length=100, blank=True, null=True)
    personal_site = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
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
        Tag, through="UserTag", related_name="user_tags"
    )

    def __str__(self):
        return f"{self.user.username}'s profile"


class ProfileTag(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "tag")


# Posts and related tables
class Post(models.Model):
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

    def __str__(self):
        return self.title


class PostTag(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("post", "tag")


# Events and related tables
class Event(models.Model):
    event_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    start_time = models.DateTimeField()
    location = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    links = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(
        Tag, through="EventTag", related_name="event_tags"
    )

    def __str__(self):
        return self.title


class EventTag(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("event", "tag")


# Projects and related tables
class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    links = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(
        Tag, through="ProjectTag", related_name="project_tags"
    )

    def __str__(self):
        return self.title


class ProjectTag(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("project", "tag")

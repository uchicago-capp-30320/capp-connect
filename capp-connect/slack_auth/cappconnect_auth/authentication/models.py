"""
This is not a best practice, we should likely have had one django project
Not two django projects. However, since we are where we are, it was easier
and less disruptive to just copy over the one model I needed than it was
to import it from your project, since doing so would have required messing
with your imports on your app and I don't want to touch that at all.
Any changes made on ccserver/models.py Profile need to be made here as well
"""

from django.contrib.auth.models import User
from django.db import models


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
    # Employment status is hard-coded to searching here, the default.
    # This is a user entered field
    employment_status = models.CharField(
        max_length=20,
        default="SEARCHING",
    )
    job_title = models.CharField(max_length=100, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(max_length=600, blank=True, null=True)
    # tags are omitted in this version of Profile

    class Meta:
        db_table = "ccserver_profile"

    def __str__(self):
        return f"{self.user.username}'s profile"

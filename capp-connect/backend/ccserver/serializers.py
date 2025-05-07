from rest_framework import serializers

from .models import Post, Profile, ProfileTag, Tag


class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ["tag_id", "tag_name"]


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = Profile
        fields = [
            "user",
            "slack_username",
            "linkedin_username",
            "github_username",
            "personal_site",
            "country",
            "state",
            "city",
            "phone_number",
            "photo_url",
            "employment_status",
            "job_title",
            "company",
            "bio",
            "tags",
        ]


class ProfileTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProfileTag
        fields = ["user", "tag"]


class PostSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.StringRelatedField()
    tags = serializers.StringRelatedField(many=True)

    class Meta:
        model = Post
        fields = [
            "post_id",
            "user",
            "title",
            "description",
            "post_type",
            "created_at",
            "updated_at",
            "tags",
            "links",
        ]

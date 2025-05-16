from rest_framework import serializers

from .models import Post, Profile, ProfileTag, Tag


class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ["tag_id", "tag_name"]


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.StringRelatedField()
    tags = serializers.SlugRelatedField(
        many=True, slug_field="tag_name", queryset=Tag.objects.all()
    )

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
        unique_together = ("profile", "tag")

    def update(self, instance, validated_data):
        tags_data = validated_data.pop("tags", [])
        instance = super().update(instance, validated_data)
        instance.tags.clear()
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(tag_name=tag_name)
            instance.tags.add(tag)
        return instance

    def delete(self, instance):
        instance.delete()
        return instance


class ProfileListSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.StringRelatedField()
    tags = serializers.SlugRelatedField(
        many=True, slug_field="tag_name", queryset=Tag.objects.all()
    )

    class Meta:
        model = Profile
        fields = [
            "user",
            "country",
            "state",
            "city",
            "photo_url",
            "employment_status",
            "job_title",
            "company",
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
            "start_time",
            "location",
        ]

from rest_framework import serializers

from .models import Comment, Post, Profile, ProfileTag, Tag


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
            "linkedin_url",
            "github_url",
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
    tags = serializers.SlugRelatedField(
        many=True, slug_field="tag_name", queryset=Tag.objects.all()
    )

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
        unique_together = ("post_id", "tag")

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        post = Post.objects.create(**validated_data)
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(tag_name=tag_name)
            post.tags.add(tag)
        return post

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


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.StringRelatedField()
    post = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = ["comment_id", "user", "post", "comment_text", "created_at"]

    def create(self, validated_data):
        user = validated_data.pop("user")
        post = validated_data.pop("post")
        comment = Comment.objects.create(user=user, post=post, **validated_data)
        return comment

    def delete(self, instance):
        instance.delete()
        return instance

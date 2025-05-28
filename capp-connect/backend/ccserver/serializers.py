import re

from rest_framework import serializers

from .models import (
    Comment,
    Post,
    Profile,
    ProfileTag,
    Resource,
    ResourceTag,
    Tag,
)


class TagSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for Tag model.
    
    Converts tag instances to simple string representations.
    Only includes the `tag_name` field in serialized output.
    
    Methods:
        to_representation: Returns just the tag name string
    """
    class Meta:
        model = Tag
        fields = ["tag_name"]

    def to_representation(self, instance):
        """Flatten tag representation to string.
        
        Args:
            instance (Tag): Tag instance being serialized
            
        Returns:
            str: The tag's name
        """
        return instance.tag_name


class NameSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for extracting cleaned profile names.
    
    Processes slack usernames by removing parenthetical content.
    Only includes the processed username in output.
    """
    class Meta:
        model = Profile
        fields = ["slack_username"]

    def to_representation(self, instance):
        """Clean slack username by removing parentheses content.
        
        Args:
            instance (Profile): Profile instance being serialized
            
        Returns:
            str: Cleaned username without parentheses
        """
        slack_name = instance.slack_username
        cleaned_name = re.sub(r"\(.*?\)", "", slack_name).strip()
        return cleaned_name


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    """Comprehensive serializer for Profile model.
    
    Includes all profile fields and handles tag relationships.
    Supports full update functionality for profile tags.
    
    Relationships:
        tags: M2M relationship with Tag via slug field
        
    Methods:
        update: Handles tag relationships during updates
        delete: Standard instance deletion
    """
    user = serializers.StringRelatedField()
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field="tag_name",
        queryset=Tag.objects.all(),
        required=False,
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
        """Update profile instance with nested tag handling.
        
        Clears existing tags and replaces with new set from input.
        
        Args:
            instance (Profile): Existing profile instance
            validated_data (dict): Validated input data
            
        Returns:
            Profile: Updated profile instance
        """
        tags_data = validated_data.pop("tags", None)
        instance = super().update(instance, validated_data)
        if tags_data is not None:
            instance.tags.clear()
            for tag_name in tags_data:
                tag, _ = Tag.objects.get_or_create(tag_name=tag_name)
                instance.tags.add(tag)
        return instance

    def delete(self, instance):
        """Delete profile instance.
        
        Args:
            instance (Profile): Profile to delete
            
        Returns:
            Profile: Deleted instance (before deletion)
        """
        instance.delete()
        return instance


class ProfileListSerializer(serializers.HyperlinkedModelSerializer):
    """Compact serializer for Profile listings.
    
    Includes subset of fields optimized for list views.
    Shows user info and associated tags.
    """
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
    """Serializer for ProfileTag relationship model.
    
    Maps relationships between profiles and tags.
    Includes both ends of the relationship.
    """
    class Meta:
        model = ProfileTag
        fields = ["user", "tag"]


class PostSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for Post model with full CRUD operations.
    
    Handles post-tag relationships and custom field requirements.
    Supports optional fields like `start_time` and `title`.
    
    Methods:
        create: Handles tag relationships during post creation
        update: Manages tag relationships during updates
        delete: Standard post deletion
    """
    user = serializers.StringRelatedField()
    tags = serializers.SlugRelatedField(
        many=True, slug_field="tag_name", queryset=Tag.objects.all()
    )
    start_time = serializers.DateTimeField(required=False, allow_null=True)
    title = serializers.CharField(required=False, allow_blank=True)

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
            "slack_ts",
            "client_msg_id",
            "slack_user_id",
        ]
        unique_together = ("post_id", "tag")

    def create(self, validated_data):
        """Create post with associated tags.
        
        Args:
            validated_data (dict): Validated post data
            
        Returns:
            Post: Newly created post instance
        """
        tags_data = validated_data.pop("tags", [])
        post = Post.objects.create(**validated_data)
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(tag_name=tag_name)
            post.tags.add(tag)
        return post

    def update(self, instance, validated_data):
        """Update post instance with tag relationship handling.
        
        Args:
            instance (Post): Existing post instance
            validated_data (dict): Validated update data
            
        Returns:
            Post: Updated post instance
        """
        tags_data = validated_data.pop("tags", None)
        instance = super().update(instance, validated_data)

        if tags_data is not None:
            instance.tags.clear()
            for tag_name in tags_data:
                tag, _ = Tag.objects.get_or_create(tag_name=tag_name)
                instance.tags.add(tag)

        return instance

    def delete(self, instance):
        """Delete post instance.
        
        Args:
            instance (Post): Post to delete
            
        Returns:
            Post: Deleted instance (before deletion)
        """
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


class ResourceSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(
        many=True, slug_field="tag_name", queryset=Tag.objects.all()
    )

    class Meta:
        model = Resource
        fields = [
            "resource_id",
            "title",
            "description",
            "created_at",
            "updated_at",
            "links",
            "tags",
        ]


class ResourceTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ResourceTag
        fields = ["resource", "tag"]

from rest_framework import serializers

from .models import (
    Event,
    EventTag,
    Post,
    PostTag,
    Profile,
    ProfileTag,
    Project,
    ProjectTag,
    Tag,
)


class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ["__all__"]


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ["__all__"]


class ProfileTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProfileTag
        fields = ["__all__"]


class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Post
        fields = ["__all__"]


class ContentCreateSerializer(serializers.HyperlinkedModelSerializer):
    CONTENT_TYPES = [
        ("post", "Post"),
        ("event", "Event"),
        ("project", "Project"),
    ]
    content_type = serializers.ChoiceField(choices=CONTENT_TYPES)
    user_id = serializers.IntegerField()
    title = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=1000)
    links = serializers.CharField(allow_blank=True)
    tags = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=True
    )

    # Post-specific fields
    post_id = serializers.IntegerField(required=False)
    post_type = serializers.ChoiceField(
        choices=Post.POST_TYPE_CHOICES, required=False
    )
    # Event-specific fields
    event_id = serializers.IntegerField(required=False)
    start_time = serializers.DateTimeField(required=False)
    location = serializers.CharField(max_length=100, required=False)
    # Project-specific fields
    project_id = serializers.IntegerField(required=False)

    def validate(self, data):
        content_type = data["content_type"]
        required_fields = {
            "post": ["user_id", "post_id", "title", "description", "post_type"],
            "event": [
                "user_id",
                "event_id",
                "title",
                "description",
                "start_time",
                "location",
            ],
            "project": ["user_id", "project_id", "title", "description"],
        }
        missing_fields = [
            field
            for field in required_fields[content_type]
            if field not in data
        ]
        if missing_fields:
            raise serializers.ValidationError(
                f"Missing fields for {content_type}: {', '.join(missing_fields)}"
            )
        return data

    def create(self, validated_data):
        content_type = validated_data.pop("content_type")
        user_id = validated_data.pop("user_id")
        tags = validated_data.pop("tags", [])
        links = validated_data.pop("links", None)

        if content_type == "post":
            post = Post.objects.create(user_id=user_id, **validated_data)
            for tag_id in tags:
                tag = Tag.objects.get(id=tag_id)
                PostTag.objects.create(post=post, tag=tag)
            if links:
                post.links = links
                post.save()
            return post
        elif content_type == "event":
            event = Event.objects.create(user_id=user_id, **validated_data)
            for tag_id in tags:
                tag = Tag.objects.get(id=tag_id)
                EventTag.objects.create(event=event, tag=tag)
            if links:
                event.links = links
                event.save()
            return event
        elif content_type == "project":
            project = Project.objects.create(user_id=user_id, **validated_data)
            for tag_id in tags:
                tag = Tag.objects.get(id=tag_id)
                ProjectTag.objects.create(project=project, tag=tag)
            if links:
                project.links = links
                project.save()
            return project


class ContentInfoSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.SerializerMethodField()
    user_id = serializers.IntegerField("profile.user")
    body = serializers.CharField("description")
    timestamp = serializers.DateTimeField("created_at")
    tags = serializers.SerializerMethodField()
    links = serializers.CharField("links", allow_blank=True)
    content_type = serializers.ChoiceField(
        choices=ContentCreateSerializer.CONTENT_TYPES
    )
    post_type = serializers.ChoiceField(
        choices=Post.POST_TYPE_CHOICES, required=False
    )
    start_time = serializers.DateTimeField(required=False)
    location = serializers.CharField(max_length=100, required=False)

    class Meta:
        model = Post
        fields = [
            "id",
            "user_id",
            "body",
            "timestamp",
            "tags",
            "links",
            "content_type",
            "post_type",
            "start_time",
            "location",
        ]

    def get_id(self, obj):
        if isinstance(obj, Post):
            return obj.post_id
        elif isinstance(obj, Event):
            return obj.event_id
        elif isinstance(obj, Project):
            return obj.project_id
        else:
            raise serializers.ValidationError("Invalid content type")

    def get_tags(self, obj):
        return [
            {"tag_id": tag.tag_id, "tag_name": tag.tag_name}
            for tag in obj.tags.all()
        ]

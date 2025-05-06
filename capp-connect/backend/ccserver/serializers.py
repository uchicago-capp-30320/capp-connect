from rest_framework import serializers

from .models import (
    Event,
    EventTag,
    Post,
    PostTag,
    Project,
    ProjectTag,
    Tag,
    Profile,
    ProfileTag,
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


class PostTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PostTag
        fields = ["__all__"]


class EventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ["__all__"]


class EventTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EventTag
        fields = ["__all__"]


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ["__all__"]


class ProjectTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProjectTag
        fields = ["__all__"]

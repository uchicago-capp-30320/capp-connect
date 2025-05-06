from .models import Tag, User, UserTag, Post, PostTag, Event, EventTag, Project, ProjectTag
from rest_framework import serializers

class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ['__all__']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['__all__']

class UserTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserTag
        fields = ['__all__']

class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Post
        fields = ['__all__']

class PostTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PostTag
        fields = ['__all__']

class EventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ['__all__']

class EventTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EventTag
        fields = ['__all__']

class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ['__all__']

class ProjectTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProjectTag
        fields = ['__all__']

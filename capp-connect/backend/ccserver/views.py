from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import (
    ContentCreateSerializer,
    ContentInfoSerializer,
    ProfileSerializer,
)

# Create your views here.
from .models import Event, Post, Profile, Project, Tag


# tutorial: https://www.django-rest-framework.org/tutorial/3-class-based-views/


class GetProfile(APIView):
    def get(self, request, pk, format = None):
        try:
            user = Profile.objects.get(pk=pk)
            serializer = ProfileSerializer(user)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def post(self, request, format=None):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetPost(APIView):
    def get(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, format=None):
        post = self.get_object(pk)
        serializer = ContentCreateSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateContent(APIView):  # All types of content
    def post(self, request):
        serializer = ContentCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FetchContent(APIView):
    def get(self, request):
        n = int(request.query_params.get("n", 20))
        query = request.query_params.get("query", None)
        content_type = request.query_params.get("content_type", None)

        results = {"posts": [], "events": [], "projects": []}

        def get_ids(queryset, id_field):
            if query:
                queryset = queryset.filter(title__icontains=query)
            return list(
                queryset.order_by("-created_at")[:n].values_list(
                    id_field, flat=True
                )
            )

        if content_type == "post":
            post_ids = get_ids(Post.objects.all(), "post_id")
            for post_id in post_ids:
                post = Post.objects.get(post_id=post_id)
                results["posts"].append(ContentInfoSerializer(post).data)
        elif content_type == "event":
            event_ids = get_ids(Event.objects.all(), "event_id")
            for event_id in event_ids:
                event = Event.objects.get(event_id=event_id)
                results["events"].append(ContentInfoSerializer(event).data)
        elif content_type == "project":
            project_ids = get_ids(Project.objects.all(), "project_id")
            for project_id in project_ids:
                project = Project.objects.get(project_id=project_id)
                results["projects"].append(ContentInfoSerializer(project).data)
        else:
            Response(
                {
                    "error": "Invalid content type. Must be one of: post, event, project."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(results, status=status.HTTP_200_OK)


class FetchContentInfo(APIView):
    def get(self, request):
        ids = request.query_params.getlist("ids")
        content = []

        for comp_id in ids:
            try:
                model_name, pk = comp_id.split("_")
                model = {"post": Post, "event": Event, "project": Project}[
                    model_name
                ]
                content.append(
                    ContentInfoSerializer(model.objects.get(pk=pk)).data
                )
            except (KeyError, ValueError, model.DoesNotExist):
                continue

        return Response(content, status=status.HTTP_200_OK)

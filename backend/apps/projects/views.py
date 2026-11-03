from rest_framework import generics

from .models import Project
from .serializers import ProjectDetailSerializer, ProjectListSerializer


class ProjectListView(generics.ListAPIView):
    """GET /api/projects/"""

    serializer_class = ProjectListSerializer
    pagination_class = None

    def get_queryset(self):
        return Project.objects.filter(is_published=True).prefetch_related("videos")


class ProjectDetailView(generics.RetrieveAPIView):
    """GET /api/projects/<slug>/  (includes one video per language)"""

    serializer_class = ProjectDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Project.objects.filter(is_published=True).prefetch_related("features", "videos")

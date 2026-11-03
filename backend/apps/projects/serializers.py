from rest_framework import serializers

from .models import Project, ProjectVideo


class ProjectVideoSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="get_language_display", read_only=True)
    subtitles = serializers.FileField(read_only=True, allow_null=True)

    class Meta:
        model = ProjectVideo
        fields = ["language", "label", "video", "subtitles"]


class ProjectListSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(child=serializers.CharField(), read_only=True)
    has_video = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ["slug", "title", "category", "short_description", "tags", "thumbnail", "has_video"]

    def get_has_video(self, obj):
        # uses prefetch_related("videos") from the view, so no extra query
        return len(obj.videos.all()) > 0


class ProjectDetailSerializer(ProjectListSerializer):
    features = serializers.SerializerMethodField()
    videos = ProjectVideoSerializer(many=True, read_only=True)

    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + [
            "summary",
            "challenge",
            "solution",
            "features",
            "live_url",
            "github_url",
            "videos",
        ]

    def get_features(self, obj):
        return [f.text for f in obj.features.all()]

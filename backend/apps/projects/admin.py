from django.contrib import admin
from unfold.admin import ModelAdmin, StackedInline, TabularInline

from .models import Project, ProjectFeature, ProjectVideo


class ProjectFeatureInline(TabularInline):
    model = ProjectFeature
    extra = 3


class ProjectVideoInline(StackedInline):
    """One block per language: pick language, upload that language's video."""

    model = ProjectVideo
    extra = 1
    verbose_name = "walkthrough video (one per language)"
    verbose_name_plural = "Walkthrough videos (add one per language: English, Hindi, ...)"


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = ("title", "category", "is_published", "order", "languages", "created_at")
    list_editable = ("is_published", "order")
    list_filter = ("is_published",)
    search_fields = ("title", "tech_stack")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ProjectFeatureInline, ProjectVideoInline]

    fieldsets = (
        ("Basic info", {"fields": ("title", "slug", "category", "short_description", "tech_stack")}),
        ("Story", {"fields": ("summary", "challenge", "solution")}),
        ("Links & image", {"fields": ("live_url", "github_url", "thumbnail")}),
        ("Visibility", {"fields": ("is_published", "order")}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("videos")

    @admin.display(description="Video languages")
    def languages(self, obj):
        names = [v.get_language_display() for v in obj.videos.all()]
        return ", ".join(names) or "-"

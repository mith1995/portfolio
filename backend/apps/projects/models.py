from django.core.validators import FileExtensionValidator
from django.db import models

video_validator = FileExtensionValidator(["mp4", "webm"])
subtitle_validator = FileExtensionValidator(["vtt"])

# Languages you can record a walkthrough in. To add one more language, add a
# line here, then run: python manage.py makemigrations projects && migrate
LANGUAGE_CHOICES = [
    ("en", "English"),
    ("hi", "हिन्दी"),
    ("gu", "ગુજરાતી"),
]


class Project(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, help_text="Used in the URL: /projects/<slug>")
    category = models.CharField(max_length=100, help_text="e.g. Dashboard / Python")
    short_description = models.CharField(max_length=300)
    summary = models.TextField(help_text="Overview section")
    challenge = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    tech_stack = models.CharField(
        max_length=300, help_text="Comma separated, e.g. Django, PostgreSQL, REST API"
    )

    live_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    thumbnail = models.ImageField(upload_to="project_thumbnails/", blank=True)

    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Smaller number shows first")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title

    @property
    def tags(self):
        return [t.strip() for t in self.tech_stack.split(",") if t.strip()]


class ProjectFeature(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="features")
    text = models.CharField(max_length=300)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.text


class ProjectVideo(models.Model):
    """One walkthrough recording of a project in ONE language.

    Add one row per language (e.g. English + Hindi). The website shows a
    language button for each row and switches the video (and its audio).
    """

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="videos")
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES)
    video = models.FileField(
        upload_to="project_videos/",
        validators=[video_validator],
        help_text="mp4 or webm, you speaking in this language. Compress first (720p, ~20-50 MB).",
    )
    subtitles = models.FileField(
        "Subtitles (.vtt)",
        upload_to="project_subtitles/",
        blank=True,
        validators=[subtitle_validator],
        help_text="Optional. Text of what you say in THIS video, same language, WebVTT format.",
    )
    order = models.PositiveIntegerField(default=0, help_text="Smaller number = first/default button")

    class Meta:
        ordering = ["order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["project", "language"], name="one_video_per_language_per_project"
            )
        ]

    def __str__(self):
        return f"{self.project.title} ({self.get_language_display()})"

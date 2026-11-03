from django.core.validators import FileExtensionValidator
from django.db import models


class Profile(models.Model):
    """Single row that holds everything about you. Always pk=1 (singleton)."""

    full_name = models.CharField(max_length=120)
    headline = models.CharField(
        max_length=160, help_text="Short title, e.g. Python Django + React Full Stack Developer"
    )
    intro = models.TextField(help_text="Hero paragraph under the big heading")
    availability_text = models.CharField(
        max_length=160, blank=True, help_text="Green badge text, e.g. Open to full-time roles"
    )
    focus_points = models.TextField(
        blank=True, help_text="Rotating hero lines. ONE LINE PER SLIDE."
    )

    about_heading = models.CharField(max_length=200, blank=True)
    about_text = models.TextField(blank=True, help_text="Blank line = new paragraph")

    experience_label = models.CharField(
        max_length=30, blank=True, help_text="Shown in the profile card, e.g. 4+ yrs"
    )
    open_to = models.TextField(
        blank=True, help_text="Hire-me card list, e.g. Full-time roles. ONE LINE PER ITEM."
    )

    photo = models.ImageField(upload_to="profile/", blank=True)
    resume = models.FileField(
        upload_to="resume/",
        blank=True,
        validators=[FileExtensionValidator(["pdf"])],
    )

    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=120, blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    def save(self, *args, **kwargs):
        self.pk = 1  # keep it a singleton
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name


class Highlight(models.Model):
    """Small cards in the About section (e.g. Backend, Frontend, Database)."""

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="highlights")
    title = models.CharField(max_length=60)
    text = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class SkillGroup(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="skill_groups")
    title = models.CharField(max_length=60)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Skill(models.Model):
    group = models.ForeignKey(SkillGroup, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=60)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name


class Experience(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="experiences")
    role = models.CharField(max_length=120)
    company = models.CharField(max_length=120)
    period = models.CharField(max_length=60, help_text="e.g. Jul 2022 - Aug 2024")
    description = models.TextField(help_text="ONE LINE PER BULLET POINT")
    order = models.PositiveIntegerField(default=0, help_text="Smaller number shows first")

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.role} @ {self.company}"

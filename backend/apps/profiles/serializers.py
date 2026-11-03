from rest_framework import serializers

from .models import Experience, Highlight, Profile, SkillGroup


def split_lines(text):
    return [line.strip() for line in (text or "").splitlines() if line.strip()]


class HighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Highlight
        fields = ["title", "text"]


class SkillGroupSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()

    class Meta:
        model = SkillGroup
        fields = ["title", "skills"]

    def get_skills(self, obj):
        return [skill.name for skill in obj.skills.all()]


class ExperienceSerializer(serializers.ModelSerializer):
    bullets = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = ["role", "company", "period", "bullets"]

    def get_bullets(self, obj):
        return split_lines(obj.description)


class ProfileSerializer(serializers.ModelSerializer):
    focus_points = serializers.SerializerMethodField()
    open_to = serializers.SerializerMethodField()
    about_paragraphs = serializers.SerializerMethodField()
    highlights = HighlightSerializer(many=True, read_only=True)
    skill_groups = SkillGroupSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = [
            "full_name",
            "headline",
            "intro",
            "availability_text",
            "focus_points",
            "about_heading",
            "about_paragraphs",
            "experience_label",
            "open_to",
            "photo",
            "resume",
            "email",
            "phone",
            "location",
            "github_url",
            "linkedin_url",
            "highlights",
            "skill_groups",
            "experiences",
        ]

    def get_focus_points(self, obj):
        return split_lines(obj.focus_points)

    def get_open_to(self, obj):
        return split_lines(obj.open_to)

    def get_about_paragraphs(self, obj):
        return [p.strip() for p in (obj.about_text or "").split("\n\n") if p.strip()]

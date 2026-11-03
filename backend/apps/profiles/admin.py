from django.contrib import admin
from unfold.admin import ModelAdmin, StackedInline, TabularInline

from .models import Experience, Highlight, Profile, Skill, SkillGroup


class HighlightInline(TabularInline):
    model = Highlight
    extra = 1


class ExperienceInline(StackedInline):
    model = Experience
    extra = 1


@admin.register(Profile)
class ProfileAdmin(ModelAdmin):
    inlines = [HighlightInline, ExperienceInline]

    def has_add_permission(self, request):
        # only one profile allowed
        return not Profile.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


class SkillInline(TabularInline):
    model = Skill
    extra = 3


@admin.register(SkillGroup)
class SkillGroupAdmin(ModelAdmin):
    list_display = ("title", "order")
    list_editable = ("order",)
    inlines = [SkillInline]

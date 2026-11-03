from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path

from apps.projects.media_views import serve_media

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("apps.profiles.urls")),
    path("api/", include("apps.projects.urls")),
    path("api/", include("apps.contact.urls")),
]

if settings.DEBUG:
    # Dev-only media server with HTTP Range support, so the video can be
    # seeked/skipped. In production serve /media/ from Nginx or cloud storage.
    urlpatterns += [re_path(r"^media/(?P<path>.*)$", serve_media)]

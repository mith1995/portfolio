from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile
from .serializers import ProfileSerializer


class ProfileView(APIView):
    """GET /api/profile/ -> profile + highlights + skills + experience."""

    def get(self, request):
        profile = Profile.objects.first()
        if profile is None:
            return Response({"detail": "Profile not created yet. Add it in /admin/."}, status=404)
        return Response(ProfileSerializer(profile, context={"request": request}).data)

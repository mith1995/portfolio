from rest_framework import generics
from rest_framework.throttling import ScopedRateThrottle

from .serializers import ContactMessageSerializer


class ContactCreateView(generics.CreateAPIView):
    """POST /api/contact/ - limited to 5 messages/hour per visitor (see settings)."""

    serializer_class = ContactMessageSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"

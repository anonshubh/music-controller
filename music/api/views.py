from rest_framework import generics

from .serializers import RoomSerializer
from music.models import Room


class RoomView(generics.ListAPIView):
    queryset =  Room.objects.all()
    serializer_class = RoomSerializer
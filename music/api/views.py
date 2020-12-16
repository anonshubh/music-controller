from rest_framework import generics,status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

from .serializers import RoomSerializer,CreateRoomSerializer
from music.models import Room


class RoomView(generics.ListAPIView):
    queryset =  Room.objects.all()
    serializer_class = RoomSerializer


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer =  self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause',None)
            votes_to_skip = serializer.data.get('votes_to_skip',None)
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause','votes_to_skip'])
            else:
                room = Room.objects.create(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    votes_to_skip=votes_to_skip)

            self.request.session['room_code'] = room.code
            response_data = RoomSerializer(room)
            return Response(response_data.data,status=status.HTTP_201_CREATED)
        return Response({"Bad Request":"Invalid Data"},status=status.HTTP_400_BAD_REQUEST)


class RoomRetrieve(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self,request,format=None):
        code = request.GET.get(self.lookup_url_kwarg,None)
        if code!=None:
            try:
                room = Room.objects.get(code=code)
                data = RoomSerializer(room).data
                data['is_host'] = self.request.session.session_key == room.host 
                return Response(data,status=status.HTTP_200_OK)
            except:
                return Response({"No Such Room Exists":"Invalid Room Code"},status=status.HTTP_404_NOT_FOUND)
        
        return Response({"Bad Request":"Code Parameter Not Found in Request"},status=status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    lookup_url_kwarg = 'code'
    
    def post(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        code = request.data.get(self.lookup_url_kwarg,None)
        if code!=None:
            room_result = Room.objects.filter(code=code)
            if len(room_result)>0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message':"Room Joined!"},status=status.HTTP_200_OK)
            return Response({'Not Found':"Invalid Room Code"},status=status.HTTP_404_NOT_FOUND)

        return Response({"Bad Request":"Invalid Data"},status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    
    def get(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        data = {
            'code':self.request.session.get('room_code',None)
        }

        return JsonResponse(data,status=status.HTTP_200_OK)



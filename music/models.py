from django.db import models
import string,random


def generate_unique_code():
    length=6
    while(1):
        code = ''.join(random.choices(string.ascii_uppercase,k=length))
        if(Room.objects.filter(code=code).count())==0:
            break
    return code


class Room(models.Model):
    code = models.CharField(max_length=8,default=generate_unique_code,unique=True)
    host = models.CharField(max_length=50,unique=True)
    guest_can_pause = models.BooleanField(default=False)
    votes_to_skip = models.IntegerField(default=1)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Room Code:{self.code}, Created by:{self.host}"
from django.db import models
from django.db.models import JSONField
# Create your models here.


class Event(models.Model):
    type = models.CharField(max_length= 200)
    channel = models.CharField(max_length= 200)
    user = models.CharField(max_length= 200)
    text = models.TextField()
    ts = models.CharField(max_length= 200)
    edited = JSONField(null=True, blank=True)
    is_starred = models.BooleanField(null=True, blank=True)
    pinned_to = JSONField(null=True, blank=True)
    reactions= JSONField(null=True, blank=True)

# {
# 	"type": "message",
# 	"channel": "C123ABC456",
# 	"user": "U123ABC456",
# 	"text": "Hello world",
# 	"ts": "1355517523.000005",
# 	"is_starred": true,
# 	"pinned_to": ["C024BE7LT", ...],
# 	"reactions": [
# 		{
# 			"name": "astonished",
# 			"count": 3,
# 			"users": [ "U1", "U2", "U3" ]
# 		},
# 		{
# 			"name": "facepalm",
# 			"count": 1034,
# 			"users": [ "U1", "U2", "U3", "U4", "U5" ]
# 		}
# 	]
# }


    def __str__(self):
        return f"Event from {self.user} in {self.channel} at {self.ts}"

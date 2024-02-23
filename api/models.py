from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    User Representation
    """

    email = models.EmailField(max_length=254, blank=False, unique=True)
    avatar = models.IntegerField(null=True)
    channels = models.ManyToManyField("Channel", through="ChannelUsers")

    def __str__(self) -> str:
        return self.username

    def repr(self) -> dict:
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "avatar": self.avatar,
        }

    def get_channels(self) -> list:
        return [
            {
                "id": channel.id,
                "name": (
                    channel.name
                    if not channel.direct
                    else channel.members.exclude(id=self.id)[0].get_full_name()
                ),
                "icon": (
                    channel.icon
                    if not channel.direct
                    else channel.members.exclude(id=self.id)[0].avatar
                ),
                "last_message": channel.last_message,
                "settings": (
                    ChannelUsers.objects.filter(user=self, channel=channel)[0].repr()
                ),
            }
            for channel in self.channels.all()
        ]


class UserSettings(models.Model):
    """
    User Settings Representation
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    theme = models.PositiveSmallIntegerField(
        {0: "auto", 1: "dark", 2: "light", 3: "high-contrast"},
        default=0,
    )
    status = models.PositiveSmallIntegerField(
        {0: "offline", 1: "away", 2: "busy", 3: "available"},
        default=3,
    )
    notifications = models.BooleanField(default=True)
    notification_sound = models.BooleanField(default=True)

    def repr(self) -> dict:
        return {
            "theme": self.theme,
            "status": self.status,
            "notifications": self.notifications,
            "notification_sound": self.notification_sound,
        }


class Channel(models.Model):
    """
    Channel Representation
    """

    name = models.CharField(max_length=100, blank=True, default="")
    direct = models.BooleanField(default=False)
    direct_id = models.TextField(unique=True, blank=True)
    icon = models.IntegerField(null=True)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="ownership", null=False
    )
    members = models.ManyToManyField(
        User, through="ChannelUsers", related_name="members"
    )
    create_time = models.DateTimeField(default=timezone.now)
    last_message = models.DateTimeField(default=timezone.now)

    def repr(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "icon": self.icon,
            "create_time": self.create_time
        }


class Message(models.Model):
    """
    Message Representation
    """

    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=2000)
    is_edited = models.BooleanField(default=False)
    create_time = models.DateTimeField(default=timezone.now)


class ChannelUsers(models.Model):
    """
    Channel member representation
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    notifications = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    def repr(self) -> dict:
        return {
            "notifications": self.notifications,
            "date_joined": self.date_joined,
        }

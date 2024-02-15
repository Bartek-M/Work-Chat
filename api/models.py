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

    def __str__(self):
        return self.username


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
    language = models.TextField(
        {0: "en", 1: "pl"},
        default=1,
    )


class Channel(models.Model):
    """
    Channel Representation
    """

    name = models.CharField(max_length=100, blank=True, default="")
    direct = models.BooleanField(default=False)
    icon = models.IntegerField(null=True)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="ownership", null=True
    )
    members = models.ManyToManyField(
        User, through="ChannelUsers", related_name="members"
    )
    create_time = models.DateTimeField(default=timezone.now)


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

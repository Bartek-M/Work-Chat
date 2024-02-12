from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    User Representation
    """

    avatar = models.IntegerField(null=True)

    def __str__(self):
        return self.user.username


class UserSettings(models.Model):
    """
    User Settings Representation
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    theme = models.PositiveSmallIntegerField(
        {0: "auto", 1: "dark", 2: "light", 3: "high-contrast"},
        default=0
    )
    status = models.PositiveSmallIntegerField(
        {0: "offline", 1: "away", 2: "busy", 3: "available"},
        default=3
    )
    notifications = models.BooleanField(default=True)
    language = models.TextField(default=True)

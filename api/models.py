from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    User Representation
    """

    avatar = models.IntegerField()

    def __str__(self):
        return self.username

class UserSettings(models.Model):
    """
    User Settings Representation
    """
    # theme = models.Choices([])
    notifications = models.BooleanField()
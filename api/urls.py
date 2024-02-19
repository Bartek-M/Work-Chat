from django.urls import path, include

from . import views

urlpatterns = [
    path("auth/", include(views.auth)),
    path("users/", include(views.users)),
    path("channels/", include(views.channels)),
]

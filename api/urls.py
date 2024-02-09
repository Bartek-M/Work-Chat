from django.urls import path, include

from . import views

urlpatterns = [
    path("auth/", include(views.auth)),
    path("user/", include(views.users)),
]

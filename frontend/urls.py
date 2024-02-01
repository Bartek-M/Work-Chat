from django.urls import path, include

urlpatterns = [
    path("", include("frontend.views.home")),
    path("", include("frontend.views.auth")),
]

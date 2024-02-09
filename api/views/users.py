from django.http import JsonResponse
from django.urls import path


def user(request):
    return JsonResponse({"Hello": "World"})


urlpatterns = [
    path("", user),
]

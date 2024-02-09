import json

from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.urls import path


@require_http_methods(["POST"])
def register(request):
    data = json.loads(request.body)

    return JsonResponse({"Hello Register": True})


def login(request):
    return JsonResponse({"Hello Login": True})


urlpatterns = [
    path("register/", register),
    path("login/", login),
]

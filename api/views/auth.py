import json

from django.views.decorators.http import require_http_methods
from django.contrib.auth import login, authenticate
from django.http import JsonResponse, HttpResponse
from django.urls import path

from api.forms import RegisterForm


@require_http_methods(["POST"])
def auth_register(request):
    form = RegisterForm(json.loads(request.body))

    if not form.is_valid():
        return JsonResponse({"errors": json.loads(form.errors.as_json())}, status=400)

    user = form.save()
    login(request, user)

    return HttpResponse(status=200)


@require_http_methods(["POST"])
def auth_login(request):
    data = json.loads(request.body)

    login_data = data.get("login_data", "").lower()
    password = data.get("password", "")

    user = authenticate(request, username=login_data, password=password)

    if user is None:
        return HttpResponse(status=403)

    login(request, user)
    return HttpResponse(status=200)


urlpatterns = [
    path("register/", auth_register),
    path("login/", auth_login),
]

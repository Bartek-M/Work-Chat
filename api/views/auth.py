import json

from django.views.decorators.http import require_http_methods
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import login
from django.core.exceptions import ValidationError
from django.http import JsonResponse, HttpResponse
from django.urls import path

from api.models import User, UserSettings


@require_http_methods(["POST"])
def auth_register(request):
    data = json.loads(request.body)

    first_name = data.get("first_name", "").capitalize()
    last_name = data.get("last_name", "").capitalize()

    username = data.get("username", "").lower()
    email = data.get("email", "").lower()
    password = data.get("password", "").lower()

    if not (first_name and last_name and username and email and password):
        return HttpResponse(status=400)

    try:
        validate_password(password)
    except ValidationError as e:
        return JsonResponse({"errors": {"password": list(e)[0]}}, status=400)

    # TODO: Add validations

    user = User.objects.create_user(username, email, password, first_name=first_name, last_name=last_name)
    UserSettings(user=user).save()

    login(request, user)
    return HttpResponse(status=200)


def auth_login(request):
    return JsonResponse({"Hello Login": True})


urlpatterns = [
    path("register/", auth_register),
    path("login/", auth_login),
]

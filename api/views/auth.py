import json

from django.views.decorators.http import require_http_methods
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.http import JsonResponse, HttpResponse
from django.urls import path

from api.models import User


@require_http_methods(["POST"])
def register(request):
    data = json.loads(request.body)

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    try:
        validate_password(password)
    except ValidationError as e:
        return JsonResponse({"errors": {"password": list(e)[0]}}, status=400)
    
    # TODO: Add validations

    user = User.objects.create_user(username, email, password)
    user.save()

    return HttpResponse(status=200)


def login(request):
    return JsonResponse({"Hello Login": True})


urlpatterns = [
    path("register/", register),
    path("login/", login),
]

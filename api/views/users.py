import json

from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.utils.translation import gettext as _
from django.http import JsonResponse
from django.urls import path

from api.models import User


def user(request):
    return JsonResponse({"Hello": "World"})


@require_http_methods(["POST"])
@login_required
def search(request):
    data = json.loads(request.body)
    username = data.get("username", "").lower()

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"errors": {"user": _("User not found")}}, status=400)

    return JsonResponse({"user": user.repr()}, status=200)


urlpatterns = [
    path("", user),
    path("search/", search),
]

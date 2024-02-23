import json

from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.utils.translation import gettext as _
from django.http import JsonResponse
from django.urls import path

from api.models import User, UserSettings


@login_required
def user(request):
    user = request.user
    settings = UserSettings.objects.get(pk=user.id)

    return JsonResponse(
        {
            "user": user.repr(),
            "settings": settings.repr(),
        },
        status=200,
    )


@login_required
def get_channels(request):
    return JsonResponse(
        {"channels": request.user.get_channels()},
        status=200,
    )


@require_http_methods(["POST"])
@login_required
def search(request):
    data = json.loads(request.body)
    username = data.get("username", "").lower()

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"errors": {"user": _("User not found")}}, status=400)

    if user.id == request.user.id:
        return JsonResponse({"errors": {"user": _("User is client user")}}, status=400)

    return JsonResponse({"user": user.repr()}, status=200)


urlpatterns = [
    path("me/", user),
    path("me/channels/", get_channels),
    path("search/", search),
]

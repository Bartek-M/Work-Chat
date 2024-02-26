import json

from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.utils.translation import gettext as _
from django.http import JsonResponse, HttpResponse
from django.urls import path

from api.models import User, UserSettings


# GET
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


# POST
@require_http_methods(["POST"])
@login_required
def search(request):
    data = json.loads(request.body)
    name = data.get("name", "")

    if len(name) < 2:
        return JsonResponse(
            {"errors": {"user": _("Pass at least 2 characters")}}, status=400
        )

    query = User.objects.exclude(id=request.user.id)
    result = (
        query.filter(username__icontains=name.lower())
        | query.filter(first_name__icontains=name)
        | query.filter(last_name__icontains=name)
    )

    if not len(result):
        return JsonResponse({"errors": {"user": _("User not found")}}, status=400)

    return JsonResponse({"users": [user.repr() for user in result[:10]]}, status=200)


# PATCH
@require_http_methods(["PATCH"])
@login_required
def change_theme(request):
    theme = json.loads(request.body).get("theme")
    avail_themes = ["auto", "dark", "light", "high-contrast"]

    if not theme or theme not in avail_themes:
        return 400

    settings = UserSettings.objects.get(pk=request.user.id)
    settings.theme = avail_themes.index(theme)
    settings.save()

    return HttpResponse(status=200)


@require_http_methods(["PATCH"])
@login_required
def change_notifications(request):
    data = json.loads(request.body)

    notifications = data.get("notifications")
    sound = data.get("sound")

    if notifications is None or sound is None:
        return 400

    settings = UserSettings.objects.get(pk=request.user.id)
    settings.notifications = True if notifications else False
    settings.notification_sound = True if sound else False
    settings.save()

    return HttpResponse(status=200)


urlpatterns = [
    path("me/", user),
    path("me/channels/", get_channels),
    path("search/", search),
    path("me/theme/", change_theme),
    path("me/notifications/", change_notifications),
]

import json

from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.urls import path

from api.forms import ChannelCreateForm


@require_http_methods(["POST"])
@login_required
def channels_create(request):
    data = json.loads(request.body)

    if data.get("members"):
        data["members"].append(request.user)
        data["owner"] = request.user.id

    form = ChannelCreateForm(data)

    if not form.is_valid():
        if channel := form.cleaned_data.get("channel"):
            return JsonResponse({"channel": channel}, status=200)

        return JsonResponse({"errors": json.loads(form.errors.as_json())}, status=400)

    channel = form.save()
    return JsonResponse({"channel": channel.repr()}, status=200)


@require_http_methods(["DELETE"])
@login_required
def channels_delete(request):
    return HttpResponse(status=200)


@login_required
def channel_messages(request):
    # CHECK IF USER BELONGS TO CHANNEL

    return


@login_required
def channel_members(request):
    # CHECK IF USER BELONGS TO CHANNEL

    return


urlpatterns = [
    path("create/", channels_create),
    path("delete/", channels_delete),
]

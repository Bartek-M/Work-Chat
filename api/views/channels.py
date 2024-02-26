import json

from django.urls import path
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse

from backend.sockets import sio
from api.forms import ChannelCreateForm, MessageCreateForm
from api.models import Channel, Message


# GET
@login_required
def channel_messages(request, channel_id):
    try:
        channel = request.user.channels.get(id=channel_id)
    except Channel.DoesNotExist:
        return HttpResponse(status=403)

    try:
        msgs = Message.objects.filter(channel_id=channel.id)[:100]
        return JsonResponse({"messages": [msg.repr() for msg in msgs]}, status=200)
    except Message.DoesNotExist:
        return JsonResponse({"messages": []}, status=200)


@login_required
def channel_members(request, channel_id):
    try:
        channel = request.user.channels.get(id=channel_id)
    except Channel.DoesNotExist:
        return HttpResponse(status=403)

    return JsonResponse(
        {"members": [user.repr() for user in channel.members.all()]}, status=200
    )


# POST
@require_http_methods(["POST"])
@login_required
def channels_create(request):
    data = json.loads(request.body)

    if not data.get("members"):
        return HttpResponse(status=400)

    data["members"].append(request.user)
    data["owner"] = request.user.id

    form = ChannelCreateForm(data)

    if not form.is_valid():
        if channel := form.cleaned_data.get("channel"):
            return JsonResponse({"channel": channel}, status=200)

        return JsonResponse({"errors": json.loads(form.errors.as_json())}, status=400)

    channel = form.save()

    for member in channel.members.all():
        user_room = f"user-{member.id}"
        if not any(user_room in room for room in sio.manager.rooms.values()):
            continue

        sio.emit(
            "channel_create",
            {
                **channel.repr(),
                "name": (
                    channel.name
                    if not channel.direct
                    else channel.members.exclude(id=member.id)[0].get_full_name()
                ),
                "icon": (
                    channel.icon
                    if not channel.direct
                    else channel.members.exclude(id=member.id)[0].avatar
                ),
            },
            room=user_room,
        )

        for sid in sio.manager.rooms["/"].get(user_room, []):
            sio.enter_room(sid, f"channel-{channel.id}")

    return JsonResponse({"channel": channel.repr()}, status=200)


@require_http_methods(["POST"])
@login_required
def message_create(request, channel_id):
    data = request.POST.copy()

    data["author"] = request.user.id
    data["channel"] = channel_id

    form = MessageCreateForm(data, request.FILES)

    if not form.is_valid():
        return JsonResponse({"errors": json.loads(form.errors.as_json())}, status=400)

    message = form.save()
    channel = message.channel
    channel.last_message = timezone.now()
    channel.save()

    sio.send(message.repr(), room=f"channel-{channel_id}")
    return JsonResponse({"message": message.repr()}, status=200)


# DELETE
@require_http_methods(["DELETE"])
@login_required
def channels_delete(request, channel_id):
    return HttpResponse(status=200)


urlpatterns = [
    path("create/", channels_create),
    path("<int:channel_id>/delete/", channels_delete),
    path("<int:channel_id>/messages/", channel_messages),
    path("<int:channel_id>/members/", channel_members),
    path("<int:channel_id>/message/", message_create),
]

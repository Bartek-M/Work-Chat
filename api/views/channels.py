import json

from django.urls import path
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.utils.translation import gettext as _
from django.http import JsonResponse, HttpResponse

from backend.sockets import sio
from api.forms import ChannelCreateForm, MessageCreateForm
from api.models import Channel, Message, Files, UserSettings, ChannelUsers
from api.utils import crop_image


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

        if not channel.direct:
            sio.emit("channel_create", channel.repr(), room=user_room)
        else:
            sio.emit(
                "channel_create",
                {
                    **channel.repr(),
                    "name": (
                        user_2 := channel.members.exclude(id=member.id)[0]
                    ).get_full_name(),
                    "icon": user_2.avatar,
                    "direct": channel.direct,
                    "status_id": user_2.id,
                    "status_type": (
                        "Offline"
                        if not len(
                            sio.manager.rooms.get("/", {}).get(f"user-{user_2.id}", [])
                        )
                        else UserSettings.objects.get(pk=user_2.id).get_status_display()
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


@require_http_methods(["POST"])
@login_required
def change_icon(request, channel_id):
    try:
        channel = request.user.channels.get(id=channel_id)

        if channel.direct:
            raise Channel.DoesNotExist
    except Channel.DoesNotExist:
        return HttpResponse(status=403)

    if not (file := request.FILES.get("icon")):
        return HttpResponse(status=400)

    if not (img := crop_image(file)):
        return JsonResponse(
            {"errors": {"image": _("Invalid image format")}}, status=400
        )

    try:
        Files.objects.get(id=channel.icon).delete()
    except Files.DoesNotExist:
        pass

    file = Files(file=img)
    file.save()

    channel.icon = file.id
    channel.save()

    return JsonResponse({"id": file.id, "channel_id": channel.id}, status=200)


# PATCH


# DELETE
@require_http_methods(["DELETE"])
@login_required
def leave_channel(request, channel_id):
    try:
        channel = request.user.channels.get(id=channel_id)

        if channel.direct:
            raise Channel.DoesNotExist
    except Channel.DoesNotExist:
        return HttpResponse(status=403)

    ChannelUsers.objects.get(channel_id=channel.id, user=request.user.id).delete()

    sio.emit("leave_channel", {"channel_id": channel.id}, room=f"user-{request.user.id}")
    return HttpResponse(status=200)


urlpatterns = [
    path("create/", channels_create),
    path("<int:channel_id>/messages/", channel_messages),
    path("<int:channel_id>/members/", channel_members),
    path("<int:channel_id>/message/", message_create),
    path("<int:channel_id>/icon/", change_icon),
    path("<int:channel_id>/leave/", leave_channel),
]

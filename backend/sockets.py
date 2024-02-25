import socketio
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.auth.middleware import AuthenticationMiddleware
from django.core.handlers.wsgi import WSGIRequest

sio = socketio.Server(cors_allowed_origins="*")


@sio.on("connect")
def connect(sid, environ):
    request = WSGIRequest(environ)

    SessionMiddleware(lambda: None).process_request(request)
    AuthenticationMiddleware(lambda: None).process_request(request)

    user = request.user

    if not user.is_authenticated:
        return sio.disconnect(sid)

    if not len(sio.manager.rooms["/"].get(f"user-{user.id}", [])):
        sio.emit("status", {"id": str(user.id), "status": "online"})

    sio.enter_room(sid, f"user-{user.id}")        

    for channel in user.channels.all():
        sio.enter_room(sid, f"channel-{channel.id}")


@sio.on("disconnect")
def disconnect(sid):
    user_disconnected = None

    for room in sio.rooms(sid):
        sio.leave_room(sid, room)

        if len(sio.manager.rooms["/"].get(room, [])):
            continue

        sio.close_room(room)

        if "user-" in room:
            user_disconnected = room[5:]

    if user_disconnected:
        sio.emit("status", {"id": user_disconnected, "status": "offline"})


@sio.on("message")
def message(sid, data):
    print(sid, data)

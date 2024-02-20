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

    sio.enter_room(sid, f"user-{user.id}")

    for channel in user.channels.all():
        sio.enter_room(sid, channel.id)


@sio.on("disconnect")
def disconnect(sid):
    for room in sio.rooms(sid):
        sio.leave_room(sid, room)


@sio.on("message")
def message(sid, data):
    print(sid, data)

import socketio
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.auth.middleware import AuthenticationMiddleware
from django.core.handlers.wsgi import WSGIRequest

sio = socketio.Server(cors_allowed_origins="*")


@sio.event
def connect(sid, environ):
    request = WSGIRequest(environ)

    SessionMiddleware(lambda: None).process_request(request)
    AuthenticationMiddleware(lambda: None).process_request(request)

    if not request.user.is_authenticated:
        return sio.disconnect(sid)

    print("Client connected:", sid, request.user)


@sio.on("message")
def message(sid, data):
    print(sid, data)

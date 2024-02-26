"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os

import socketio
from django.conf import settings
from django.contrib.staticfiles.handlers import StaticFilesHandler
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

django_app = (
    get_wsgi_application()
    if not settings.DEBUG
    else StaticFilesHandler(get_wsgi_application())
)

from backend.sockets import sio
import backend.active_directory

application = socketio.WSGIApp(sio, django_app)

from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.urls import path

from api.models import UserSettings


def app(request, page):
    if not request.user.is_authenticated:
        return render(request, page)

    return redirect("/")


def chat(request):
    if not request.user.is_authenticated:
        return redirect("/home/")

    return render(
        request,
        "app.html",
        {
            "user": request.user.repr(),
            "settings": UserSettings.objects.get(pk=request.user.id).repr(),
        },
    )


home = lambda request: app(request, "home.html")
view_login = lambda request: app(request, "login.html")
view_register = lambda request: app(request, "register.html")


def view_logout(request):
    logout(request)
    return redirect("/")


urlpatterns = [
    path("", chat),
    path("home/", home),
    path("login/", view_login),
    path("register/", view_register),
    path("logout/", view_logout),
]

from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.urls import path


def home(request):
    if request.user.is_authenticated:
        return render(request, "app.html")

    return render(request, "home.html")


def docs(request):
    return render(request, "docs.html")


def view_login(request):
    return render(request, "login.html")


def view_register(request):
    return render(request, "register.html")


def view_logout(request):
    logout(request)
    return redirect("/")


urlpatterns = [
    path("", home),
    path("docs/", docs),
    path("login/", view_login),
    path("register/", view_register),
    path("logout/", view_logout),
]

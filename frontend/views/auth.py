from django.urls import path
from django.shortcuts import render, redirect
from django.contrib.auth import logout


def view_login(request):
    return render(request, "login.html")


def view_register(request):
    return render(request, "register.html")


def view_logout(request):
    logout(request)
    return redirect("/")


urlpatterns = [
    path("login/", view_login),
    path("register/", view_register),
    path("logout/", view_logout),
]

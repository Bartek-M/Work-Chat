from django.urls import path
from django.shortcuts import render
from django.http import JsonResponse


def login(request):
    return render(request, "login.html")


def register(request):
    return render(request, "register.html")


def logout(request):
    return JsonResponse({"Logout": True})


urlpatterns = [
    path("login/", login),
    path("register/", register),
    path("logout/", logout)
]
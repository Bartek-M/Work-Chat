from django.shortcuts import render
from django.http import JsonResponse


# Main
def home(request):
    return render(request, "home.html")


def app(request):
    return render(request, "app.html")


# Authentication
def login(request):
    return render(request, "login.html")


def register(request):
    return render(request, "register.html")


def logout(request):
    return JsonResponse({"Logout": True})

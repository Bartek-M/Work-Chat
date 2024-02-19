from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.urls import path


def home(request):
    return render(request, "app.html" if request.user.is_authenticated else "home.html", {"range": range(20)})


def docs(request):
    return render(request, "docs.html")


def view_login(request):
    return render(
        request, "app.html" if request.user.is_authenticated else "login.html"
    )


def view_register(request):
    return render(
        request, "app.html" if request.user.is_authenticated else "register.html"
    )


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

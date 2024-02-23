from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.urls import path


def app(request, page):
    if not request.user.is_authenticated:
        return render(request, page)

    return render(
        request,
        "app.html",
        {
            "user": request.user,
            "channels": sorted(
                request.user.channels.all(), key=lambda ch: ch.last_message
            ),
        },
    )


home = lambda request: app(request, "home.html")
docs = lambda request: render(request, "docs.html")
view_login = lambda request: app(request, "login.html")
view_register = lambda request: app(request, "register.html")


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

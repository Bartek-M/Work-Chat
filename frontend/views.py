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
                request.user.get_channels(),
                key=lambda ch: ch.get("last_message"),
                reverse=True,
            ),
        },
    )


home = lambda request: app(request, "home.html")
view_login = lambda request: app(request, "login.html")
view_register = lambda request: app(request, "register.html")


def view_logout(request):
    logout(request)
    return redirect("/")


urlpatterns = [
    path("", home),
    path("login/", view_login),
    path("register/", view_register),
    path("logout/", view_logout),
]

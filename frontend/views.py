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
                request.user.get_channels(), key=lambda ch: ch.get("last_message")
            ),
        },
    )


home = lambda request: app(request, "home.html")
view_login = lambda request: app(request, "login.html")
view_register = lambda request: app(request, "register.html")

docs_main = lambda request: render(request, "docs/main.html")
docs_install = lambda request: render(request, "docs/install.html")
docs_manual = lambda request: render(request, "docs/manual.html")

def view_logout(request):
    logout(request)
    return redirect("/")


urlpatterns = [
    path("", home),
    path("login/", view_login),
    path("register/", view_register),
    path("logout/", view_logout),
    path("docs/", docs_main),
    path("docs/install/", docs_install),
    path("docs/manual/", docs_manual),
]

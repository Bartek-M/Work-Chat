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

docs_main = lambda request: render(request, "docs/main.html")
docs_install = lambda request: render(request, "docs/install.html")
docs_manual = lambda request: render(request, "docs/manual.html")
docs_backups = lambda request: render(request, "docs/backups.html")
docs_functions = lambda request: render(request, "docs/functions.html")
docs_scalability = lambda request: render(request, "docs/scalability.html")
docs_security = lambda request: render(request, "docs/security.html")
docs_performence = lambda request: render(request, "docs/performence.html")


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
    path("docs/backups/", docs_backups),
    path("docs/functions/", docs_functions),
    path("docs/scalability/", docs_scalability),
    path("docs/security/", docs_security),
    path("docs/performence/", docs_performence),
]

from django.shortcuts import render
from django.urls import path

docs_main = lambda request: render(request, "docs/main.html")
docs_install = lambda request: render(request, "docs/install.html")
docs_manual = lambda request: render(request, "docs/manual.html")
docs_backups = lambda request: render(request, "docs/backups.html")
docs_info = lambda request: render(request, "docs/info.html")

urlpatterns = [
    path("", docs_main),
    path("install/", docs_install),
    path("manual/", docs_manual),
    path("backups/", docs_backups),
    path("info/", docs_info),
]

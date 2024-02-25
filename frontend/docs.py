from django.shortcuts import render
from django.urls import path

docs_main = lambda request: render(request, "docs/main.html")
docs_install = lambda request: render(request, "docs/install.html")
docs_manual = lambda request: render(request, "docs/manual.html")
docs_backups = lambda request: render(request, "docs/backups.html")
docs_functions = lambda request: render(request, "docs/functions.html")
docs_scalability = lambda request: render(request, "docs/scalability.html")
docs_security = lambda request: render(request, "docs/security.html")
docs_performance = lambda request: render(request, "docs/performance.html")

urlpatterns = [
    path("", docs_main),
    path("install/", docs_install),
    path("manual/", docs_manual),
    path("backups/", docs_backups),
    path("functions/", docs_functions),
    path("scalability/", docs_scalability),
    path("security/", docs_security),
    path("performance/", docs_performance),
]

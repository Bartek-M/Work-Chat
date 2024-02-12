from django.urls import path
from django.shortcuts import render

def home(request):
    if request.user.is_authenticated:
        return render(request, "app.html")

    return render(request, "home.html")

def docs(request):
    return render(request, "docs.html")


urlpatterns = [
    path("", home),
    path("docs/", docs),
]

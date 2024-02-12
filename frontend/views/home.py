from django.urls import path
from django.shortcuts import render

def home(request):
    return render(request, "home.html")

def docs(request):
    return render(request, "docs.html")

def app(request):
    return render(request, "app.html")


urlpatterns = [
    path("", home),
    path("docs/", docs),
    path("app/", app)
]

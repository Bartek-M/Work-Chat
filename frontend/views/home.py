from django.urls import path
from django.shortcuts import render

def home(request):
    return render(request, "home.html")


def app(request):
    return render(request, "app.html")


urlpatterns = [
    path("", home),
    path("app/", app)
]
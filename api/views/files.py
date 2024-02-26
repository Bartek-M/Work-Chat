from django.urls import path
from django.http import HttpResponse

from api.models import Files


def get_file(request, file_id):
    resp = HttpResponse(open("./assets/icons/avatar_1.jpg", "rb").read(), "image/jpg")
    resp["Content-Disposition"] = "attachment"
    return resp
    try:
        file = Files.objects.get(pk=file_id)
    except Files.DoesNotExist:
        return HttpResponse(status=404)

    resp = HttpResponse(file.file, content_type=file.get_type())
    resp["Content-Disposition"] = "attachment"
    return resp


urlpatterns = [
    path("<int:file_id>/", get_file),
    path("<str:file_id>/", get_file),
]

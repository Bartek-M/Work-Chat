from django.urls import path
from django.http import HttpResponse, FileResponse

from api.models import Files


def get_file(request, file_id):
    try:
        file = Files.objects.get(pk=file_id)
    except Files.DoesNotExist:
        return HttpResponse(status=404)

    resp = HttpResponse(file.file, content_type=file.get_type())
    resp["Content-Disposition"] = "attachment"
    return resp


def upload_file(request):
    return HttpResponse(status=200)


urlpatterns = [
    path("<int:file_id>/", get_file),
    path("upload/", upload_file),
]

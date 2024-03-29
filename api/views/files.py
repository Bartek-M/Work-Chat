from django.urls import path
from django.http import HttpResponse

from api.models import Files, MessageFiles


def get_file(request, file_id):
    try:
        file = Files.objects.get(pk=file_id)
    except Files.DoesNotExist:
        return HttpResponse(status=404)
    
    try:
        file_data = MessageFiles.objects.get(file_id=file.id)
        file_name = file_data.name
    except MessageFiles.DoesNotExist:
        file_name = "untitled.webp"

    resp = HttpResponse(file.file, content_type=file.get_type())
    resp["Content-Disposition"] = f"attachment; filename={file_name}"
    return resp


urlpatterns = [
    path("<int:file_id>/", get_file),
]

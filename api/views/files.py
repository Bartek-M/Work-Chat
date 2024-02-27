from django.urls import path
from django.http import HttpResponse

from api.models import Files, MessageFiles


def get_file(request, file_id):
    try:
        file = Files.objects.get(pk=file_id)
        file_data = MessageFiles.objects.get(file_id=file.id)
    except Files.DoesNotExist or MessageFiles.DoesNotExist:
        return HttpResponse(status=404)

    resp = HttpResponse(file.file, content_type=file.get_type())
    resp["Content-Disposition"] = f"attachment; filename={file_data.name}"
    return resp


urlpatterns = [
    path("<int:file_id>/", get_file),
]

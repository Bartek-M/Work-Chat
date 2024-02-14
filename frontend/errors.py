from django.http import JsonResponse


def error_400(response, exception=None):
    return JsonResponse({"error": "400 Bad Request"}, status=400)


def error_403(response, exception=None):
    return JsonResponse({"error": "403 Forbidden"}, status=403)


def error_404(response, exception=None):
    return JsonResponse({"error": "404 Not Found"}, status=404)

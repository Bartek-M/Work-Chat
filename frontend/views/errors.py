from django.http import JsonResponse


def error_404(response, exception=None):
    return JsonResponse({"error": "404 Not Found"}, status=404)

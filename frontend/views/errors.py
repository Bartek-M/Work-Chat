from django.http import JsonResponse

def error_401(response, exception=None):
    return JsonResponse({"error": "401 Unauthorized"}, status=401)

def error_403(response, exception=None):
    return JsonResponse({"error": "403 Forbidden"}, status=403)

def error_404(response, exception=None):
    return JsonResponse({"error": "404 Not Found"}, status=404)

def error_405(response, exception=None):
    return JsonResponse({"error": "405 Method Not Allowed"}, status=405)

from django.http import JsonResponse

def error_401(response, exception=None):
    return JsonResponse({"error": "401 Unauthorized"}, status=401)

def error_404(response, exception=None):
    return JsonResponse({"error": "404 Not Found"}, status=404)

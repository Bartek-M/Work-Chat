from django.http import JsonResponse

def user(request):
    return JsonResponse({"Hello": "World"})

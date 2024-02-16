from django.utils.translation import activate, get_language


class ActivateLanguage:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        activate("pl")
        return self.get_response(request)

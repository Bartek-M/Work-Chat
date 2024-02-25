from django.contrib import admin

from .models import User, UserSettings, Channel, ChannelUsers

admin.site.register(User)
admin.site.register(UserSettings)
admin.site.register(Channel)
admin.site.register(ChannelUsers)

from django.contrib import admin

from .models import NotificationSettings, Profile, Subscription

admin.site.register(Profile)
admin.site.register(Subscription)
admin.site.register(NotificationSettings)
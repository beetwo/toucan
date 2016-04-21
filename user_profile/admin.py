from django.contrib import admin

from .models import NotificationSettings, Profile, Subscription

admin.site.register(Profile)
admin.site.register(Subscription)


class NotificationSettingAdmin(admin.ModelAdmin):

    list_display = ('user', 'notification_type', 'point', 'point_radius')

admin.site.register(NotificationSettings, NotificationSettingAdmin)

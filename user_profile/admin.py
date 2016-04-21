from django.contrib import admin

from .models import NotificationSettings, Profile, Subscription

admin.site.register(Subscription)


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number')


admin.site.register(Profile, ProfileAdmin)

class NotificationSettingAdmin(admin.ModelAdmin):

    list_display = ('user', 'notification_type', 'point', 'point_radius')

admin.site.register(NotificationSettings, NotificationSettingAdmin)

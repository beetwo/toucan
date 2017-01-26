from django.conf.urls import url
from .views import PersonalProfile, NotificationEditView, NotificationCreate, PublicProfile, \
    UpdatePhoneNumber, NotificationDeleteView, UpdateMentionNotificationSettingsView

urlpatterns = [
    url(r'^profile/(?P<username>[\w.@+-]+)/$', PublicProfile.as_view(), name='public_profile'),
    url(r'^$', PersonalProfile.as_view(), name='personal_profile'),
    url(r'^edit/$', UpdateMentionNotificationSettingsView.as_view(), name='update_profile'),
    url(r'^edit/phone/$', UpdatePhoneNumber.as_view(), name='update_phone'),
    url(r'^notifications/add/$', NotificationCreate.as_view(), name='notification_create'),
    url(r'^notifications/(?P<notification_id>\d+)/$', NotificationEditView.as_view(), name='notification_edit'),
    url(r'^notifications/(?P<notification_id>\d+)/delete/$', NotificationDeleteView.as_view(), name='notification_delete')
]

from django.conf.urls import url
from .views import PersonalProfile, UpdateProfile, NotificationEdit, NotificationCreate, PublicProfile

urlpatterns = [
    url(r'^profile/(?P<username>[\w.@+-]+$)/$', PublicProfile.as_view(), name='public_profile'),
    url(r'^$', PersonalProfile.as_view(), name='personal_profile'),
    url(r'^edit/$', UpdateProfile.as_view(), name='update_profile'),
    url(r'^notifications/add/$', NotificationCreate.as_view(), name='notification_create'),
    url(r'^notifications/(?P<notification_id>\d+)/$', NotificationEdit.as_view(), name='notification_edit')
]

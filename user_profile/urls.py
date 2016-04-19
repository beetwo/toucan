from django.conf.urls import url
from .views import ViewProfile, UpdateProfile, NotificationEdit

urlpatterns = [
    url(r'^$', ViewProfile.as_view(), name='view_profile'),
    url(r'^edit/$', UpdateProfile.as_view(), name='update_profile'),
    url(r'^notifications/(?P<notification_id>\d+)/$', NotificationEdit.as_view(), name='notification_edit')
]

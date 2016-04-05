from django.conf.urls import url
from .views import ViewProfile, UpdateProfile

urlpatterns = [
    url(r'^$', ViewProfile.as_view(), name='view_profile'),
    url(r'^edit/$', UpdateProfile.as_view(), name='update_profile'),
]

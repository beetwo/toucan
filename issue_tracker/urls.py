from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import RedirectView
from issues.views import HomeView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^api/', include('api.urls')),
    url(r'^org/', include('organisations.urls')),
    url(r'^$', HomeView.as_view(), name='home'),
    url(r'^issues/', include('issues.urls', 'issue_app')),
    url(r'^profile/', include('user_profile.urls', 'user_profile'))
    # url(r'^$', RedirectView.as_view(url='/map/')),
]

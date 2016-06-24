from django.conf.urls import url, include
from django.conf import settings
from django.contrib import admin

from issues.views import HomeView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^api/', include('api.urls')),
    url(r'^org/', include('organisations.urls')),
    url(r'^issues/', include('issues.urls', 'issue_app')),
    url(r'^profile/', include('user_profile.urls', 'user_profile')),
]


if settings.DEBUG:

    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += staticfiles_urlpatterns()

urlpatterns += [
    url(r'^issue/(?P<issue_id>\d+)', HomeView.as_view(), name='home_issue'),
    # keep this at the bottom as it eats urls!
    url(r'^', HomeView.as_view(), name='home')
]



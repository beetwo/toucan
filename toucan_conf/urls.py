from django.conf import settings
from django.conf.urls import url, include
from django.contrib import admin
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from toucan.invitations.views import InvitedSignupView
from toucan.issues.views import HomeView
from toucan.utils.views import MultiTemplateView



urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # these next 2 lines are important!
    url(r'^accounts/signup/', InvitedSignupView.as_view(), name='account_signup'),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^invitations/', include('toucan.invitations.urls')),
    url(r'^api/', include('toucan.api.urls')),
    url(r'^org/', include('toucan.organisations.urls', 'organisations')),
    url(r'^issues/', include('toucan.issues.urls', 'issue_app')),
    url(r'^profile/', include('toucan.user_profile.urls', 'user_profile')),
    url(r'^help/', include('toucan.help.urls', 'help'))
]


if settings.DEBUG:

    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += staticfiles_urlpatterns()

    import debug_toolbar

    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]

    from toucan.notifications.debug import generate_notifications
    urlpatterns += [
        url(r'^__generate_notifications__/$', generate_notifications, name='generate_notifications')
    ]



class RedirectAuthenticatedUsers(MultiTemplateView):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated():
            return HttpResponseRedirect(reverse('home'))
        return super().get(request, *args, **kwargs)


urlpatterns += [
    url(r'^map/', include([
        # this is needed for reversing the issue url in the notifications
        url(r'^issue/(?P<issue_id>\d+)', HomeView.as_view(), name='home_issue'),
        url(r'', HomeView.as_view(), name='home'),  # => Single Page App
    ])),
    url(r'^$', RedirectAuthenticatedUsers.as_view(
        template_names=[
            'toucan/index.html',
            'default/landing_page.html'
        ]),
        name='landing_page'),
]



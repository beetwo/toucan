from django.conf.urls import url
from django.views.generic import TemplateView
from .views import HelpPage
urlpatterns = [
    url(r'^$', HelpPage.as_view(), name='start'),
    url(r'^initial_login/$', TemplateView.as_view(template_name='help/first_steps.html'), name='first_steps'),
]
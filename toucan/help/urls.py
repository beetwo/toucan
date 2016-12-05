from django.conf.urls import url
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='help/start.html'), name='start'),
    url(r'^initial_login/$', TemplateView.as_view(template_name='help/first_steps.html'), name='first_steps'),
]
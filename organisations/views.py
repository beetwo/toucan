from django.views.generic import ListView, DetailView

from .models import Organisation


class OrganisationList(ListView):
    model = Organisation
    template_name = 'organisations/list.html'


class OrganisationDetail(DetailView):
    model = Organisation
    pk_url_kwarg = 'org_id'
    template_name = 'organisations/detail.html'
from django.views.generic import TemplateView, DetailView, CreateView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.urlresolvers import reverse
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import ugettext_lazy as _

from braces.views import FormValidMessageMixin

from .models import Issue
from .forms import IssueForm, LatLngForm


class HomeView(LoginRequiredMixin, TemplateView):

    template_name = 'issues/map.html'


class IssueCreateView(LoginRequiredMixin, FormValidMessageMixin, CreateView):

    model = Issue
    template_name = 'issues/issue/create.html'
    form_class = IssueForm
    form_valid_message = _('Issue created.')

    def get_initial(self):
        initial = super().get_initial()
        f = LatLngForm(data=self.request.GET)
        if f.is_valid():
            initial.update({
                'point': f.to_point()
            })
        return initial

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        p = ctx['form'].initial.get('point')
        if p:
            ctx.update({'initial_point': p})
        return ctx

    def form_valid(self, form):
        issue = form.instance
        user = self.request.user
        issue.created_by = user

        try:
            issue.organisation = self.request.user.membership.org
        except ObjectDoesNotExist:
            issue.organisation = None

        return super().form_valid(form)

    def get_success_url(self):
        return reverse(
            'home_issue',
            kwargs={'issue_id': self.object.pk},
            current_app=self.request.resolver_match.namespace
        )


class EditIssueView(LoginRequiredMixin, FormValidMessageMixin, UpdateView):

    template_name = 'issues/issue/edit.html'
    form_class = IssueForm
    form_valid_message = _('Issue updated.')
    pk_url_kwarg = 'issue_id'

    def get_queryset(self):
        return Issue.objects.filter(created_by=self.request.user)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx.update({
            'initial_point': self.object.point
        })
        return ctx

    def get_success_url(self):
        return reverse(
            'issues:issue_detail',
            kwargs={'issue_id': self.object.pk},
            current_app=self.request.resolver_match.namespace
        )


from django.views.generic import TemplateView, ListView, DetailView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404
from django.core.urlresolvers import reverse
from django.contrib.gis.db.models import Extent
from django.utils.translation import ugettext_lazy as _

from braces.views import FormValidMessageMixin
from organisations.models import Location

from .models import Issue
from .forms import CommentForm


class HomeView(TemplateView):

    template_name = 'issues/map.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        # get the extents for the locations to be viewed
        extent = Location.objects.aggregate(ext=Extent('location'))['ext']
        ctx['initial_map_extent'] = extent

        # get all location object
        ctx['locations'] = Location.objects.all()
        # annotate(json=AsGeoJSON('location'))
        ctx['issues'] = Issue.objects.all().select_related('created_by', 'organisation')

        return ctx


class IssueList(ListView):
    template_name = 'issues/issue_list.html'
    model = Issue


class IssueDetail(DetailView):

    template_name = 'issues/issue_detail.html'
    model = Issue
    pk_url_kwarg = 'issue_id'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx.update({'comment_form': CommentForm()})
        return ctx


class IssueCreateView(CreateView):
    model = Issue
    template_name = 'issues/issue_create.html'
    fields = [
        'title',
        'description',
    ]

    def get_success_url(self):
        return reverse(
            'issues:issue_detail',
            kwargs={'issue_id': self.object.pk},
            current_app=self.request.resolver_match.namespace
        )


class BaseIssueMixin(object):

    def get_issue(self):
        return get_object_or_404(Issue, pk=self.kwargs.get('issue_id'))

    @property
    def issue(self):
        return self.get_issue()


class CommentCreateView(LoginRequiredMixin, FormValidMessageMixin, BaseIssueMixin, CreateView):

    template_name = 'issues/comment_form_full.html'
    form_class = CommentForm
    form_valid_message = _('comment saved')

    def form_valid(self, form):
        comment = form.instance
        comment.created_by = self.request.user
        comment.issue = self.issue
        return super().form_valid(form)

    def get_success_url(self):
        return reverse(
            'issues:issue_detail',
            kwargs={'issue_id': self.issue.pk},
            current_app=self.request.resolver_match.namespace
        )

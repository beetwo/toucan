from django.views.generic import TemplateView, ListView, DetailView, CreateView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404
from django.core.urlresolvers import reverse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.gis.db.models import Extent
from django.contrib.gis.geos import Point
from django import forms
from django.utils.translation import ugettext_lazy as _
from django.db.models import Count

import django_filters
from django_filters.views import FilterView
from braces.views import FormValidMessageMixin

from organisations.models import Location, Organisation
from .models import Issue
from .forms import CommentForm, IssueForm


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


class IssueFilter(django_filters.FilterSet):

    current_status = django_filters.ChoiceFilter(
        choices=Issue.STATUS_CHOICES,
        initial='open'
    )

    class Meta:
        model = Issue
        fields = [
            'issue_type',
            'organisation',
            'current_status'
        ]


class IssueList(FilterView):

    template_name = 'issues/issue/list.html'
    filterset_class = IssueFilter

    def get_queryset(self):
        # TODO: limit by visibility field
        return Issue.objects.order_by('-created') \
            .annotate(comment_count=Count('comments'))\
            .select_related('organisation')


class IssueDetail(DetailView):

    template_name = 'issues/issue/detail.html'
    model = Issue
    pk_url_kwarg = 'issue_id'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx.update({'comment_form': CommentForm()})
        return ctx


class LatLngForm(forms.Form):
    lat = forms.FloatField()
    lng = forms.FloatField()

    def to_point(self):
        return Point(
            self.cleaned_data['lng'],
            self.cleaned_data['lat']
        )

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
    model = Issue
    template_name = 'issues/issue/edit.html'
    form_class = IssueForm
    form_valid_message = _('Issue updated.')
    pk_url_kwarg = 'issue_id'

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

    def get_form_class(self):
        fc = super().get_form_class()
        return fc

    def form_valid(self, form):
        comment = form.instance
        comment.user = self.request.user
        comment.issue = self.issue
        return super().form_valid(form)

    def get_success_url(self):
        return reverse(
            'issues:issue_detail',
            kwargs={'issue_id': self.issue.pk},
            current_app=self.request.resolver_match.namespace
        )

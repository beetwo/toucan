# from django.db import models
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from model_utils import Choices

from model_utils.models import TimeStampedModel


class IssueType(TimeStampedModel):
    name = models.CharField(max_length=50)
    slug = models.SlugField()
    svg_icon = models.FileField(blank=True, upload_to='markers')

    def __str__(self):
        return self.name


class Issue(TimeStampedModel):

    PRIORITY_CHOICES = Choices(
        (0, 'low', _('low')),
        (1, 'normal', _('normal')),
        (2, 'high', _('high')),
        (3, 'alarm', _('alarm'))
    )

    VISIBILITY_CHOICES = Choices(
        (0, 'private', _('private')),
        (1, 'members', _('all organisation members')),
        (2, 'users', _('all registered users')),
        (3, 'public', _('public')),
    )

    title = models.CharField(max_length=300,
                             verbose_name=_('issue title'))

    description = models.TextField(blank=False)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    point = models.PointField(verbose_name=_('location'), null=True)
    # location = models.ForeignKey('organisations.Location', null=True, verbose_name='location')

    organisation = models.ForeignKey(
        'organisations.Organisation',
        null=True, blank=False,
        verbose_name=_('organisation')
    )

    priority = models.SmallIntegerField(choices=PRIORITY_CHOICES, default=1)
    visibility = models.SmallIntegerField(choices=VISIBILITY_CHOICES, default=3)

    issue_type = models.ForeignKey(IssueType, null=True, blank=True)

    @property
    def gis_location(self):
        return self.point

    class Meta:
        verbose_name = _('issue')
        verbose_name_plural = _('issues')

    def __str__(self):
        return self.title


class IssueStatus(TimeStampedModel):

    STATUS_CHOICES = Choices([
        ('open', _('open')),
        ('closed', _('closed'))
    ])

    issue = models.ForeignKey(Issue, related_name='status')

    status = models.CharField(max_length=10, db_index=True, choices=STATUS_CHOICES)
    status_message = models.TextField(blank=True, verbose_name=_('reason'))

    class Meta:
        get_latest_by = 'created'
        verbose_name = _('issue status')
        verbose_name_plural = _('issue statuses')


class IssueComment(TimeStampedModel):

    issue = models.ForeignKey(Issue, related_name='comments')
    comment = models.TextField(blank=True, verbose_name=_('comment'))

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL)

    class Meta:
        verbose_name = _('comment')
        verbose_name_plural = _('comments')
        ordering = ['created']

    def __str__(self):
        return 'Comment by user %s on issue #%d' % (self.created_by.username, self.issue_id)

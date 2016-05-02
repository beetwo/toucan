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

    title = models.CharField(
        max_length=300,
        verbose_name=_('issue title')
    )

    description = models.TextField(blank=False)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    point = models.PointField(verbose_name=_('location'), null=True)
    # location = models.ForeignKey('organisations.Location', null=True, verbose_name='location')

    organisation = models.ForeignKey(
        'organisations.Organisation',
        null=True, blank=False,
        default='',
        verbose_name=_('organisation')
    )

    issue_type = models.ForeignKey(IssueType, null=True)

    priority = models.SmallIntegerField(choices=PRIORITY_CHOICES, default=1)
    visibility = models.SmallIntegerField(choices=VISIBILITY_CHOICES, default=3)

    @property
    def status(self):
        try:
            return self.status_changes.latest().status
        except IssueStatus.DoesNotExist:
            return 'open'

    @property
    def gis_location(self):
        return self.point

    class Meta:
        verbose_name = _('issue')
        verbose_name_plural = _('issues')
        ordering = ('-created',)

    def __str__(self):
        return self.title


class AbstractIssueRelatedModel(TimeStampedModel):

    user = models.ForeignKey(settings.AUTH_USER_MODEL)

    class Meta:
        abstract = True
        ordering = ('created',)


class IssueComment(AbstractIssueRelatedModel):

    issue = models.ForeignKey(Issue, related_name='comments')
    comment = models.TextField(blank=True, verbose_name=_('comment'))

    class Meta:
        verbose_name = _('comment')
        verbose_name_plural = _('comments')

    def __str__(self):
        return 'Comment by user %s on issue #%d' % (self.user.username, self.issue_id)


class IssueStatus(AbstractIssueRelatedModel):

    issue = models.ForeignKey(Issue, related_name='status_changes')

    STATUS_CHOICES = Choices(
        ('open', _('open')),
        ('closed', _('closed'))
    )

    status = models.CharField(max_length=10, db_index=True, choices=STATUS_CHOICES)

    class Meta:
        verbose_name = _('issue status')
        verbose_name_plural = _('issue statuses')
        get_latest_by = ('created')

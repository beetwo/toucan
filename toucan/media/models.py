from django.db import models
from django.conf import settings

from model_utils.models import TimeStampedModel
from model_utils.managers import InheritanceManager

from issues.models import IssueComment


class MediaFile(TimeStampedModel):

    comment = models.ForeignKey(IssueComment, null=True, blank=True)
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    objects = models.Manager()
    media_objects = InheritanceManager()


class ImageFile(MediaFile):

    width = models.IntegerField(editable=False)
    height = models.IntegerField(editable=False)

    original_filename = models.CharField(max_length=100, blank=True)
    image = models.ImageField(
        width_field='width',
        height_field='height',
        upload_to='photos/%Y/%m/%d'
    )

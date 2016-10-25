from django.db import models
from django.conf import settings

from model_utils.models import TimeStampedModel
from model_utils.managers import InheritanceManager

from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill

from issues.models import IssueComment


class MediaFile(TimeStampedModel):

    comment = models.ForeignKey(IssueComment, null=True, blank=True)
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    objects = InheritanceManager()

    def __str__(self):
        return '{className} uploaded by {user}'.format(
            className=self.__class__.__name__,
            user=self.uploader.username if self.uploader else 'Anonymous User'
        )


class ImageFile(MediaFile):

    width = models.IntegerField(editable=False)
    height = models.IntegerField(editable=False)

    original_filename = models.CharField(max_length=100, blank=True)
    image = models.ImageField(
        width_field='width',
        height_field='height',
        upload_to='photos/%Y/%m/%d'
    )

    thumbnail = ImageSpecField(
        source='image',
        processors=[ResizeToFill(150, 150)],
        format='JPEG',
        options={'quality': 60}
    )

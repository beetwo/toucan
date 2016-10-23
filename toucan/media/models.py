from django.db import models
from model_utils.models import TimeStampedModel


class BaseMediaFile(TimeStampedModel):

    class Meta:
        abstract = True


class ImageFile(BaseMediaFile):

    width = models.IntegerField()
    height = models.IntegerField()

    image = models.ImageField(
        width_field='width',
        height_field='height'
    )
from django.db.models.signals import post_save

from django.contrib.sites.models import Site
from .models import SiteConfig


DEFAULT_AREA = "SRID=4326;POLYGON ((70.6201171776687602 35.2456190899208792, 69.3896484278406547 -2.1967272414555357, 121.7724609205460951 0.7909904980443909, 112.4560546718421108 32.7688004808185127, 70.6201171776687602 35.2456190899208792))"
DEFAULT_POINT = "SRID=4326;POINT (79.0136718640009832 23.4834006512400393)"


def create_site_config(**kwargs):
    site = kwargs['instance']
    sc, created = SiteConfig.objects.get_or_create(
        site=site,
        defaults={
            'area': DEFAULT_AREA,
            'issue_point': DEFAULT_POINT

        }
    )


post_save.connect(create_site_config, sender=Site)

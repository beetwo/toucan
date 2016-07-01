from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin

from .models import SiteConfig

# from django.contrib.sites.models import Site
# class SiteManager(OSMGeoAdmin)

admin.site.register(SiteConfig, OSMGeoAdmin)

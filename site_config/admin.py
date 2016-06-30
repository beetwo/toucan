from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import SiteConfig

admin.site.register(SiteConfig, OSMGeoAdmin)


import random

from django.contrib.gis.geos import Point
from django.conf import settings

try:
    source_coordinates = settings.FAKER_COORDINATES
except AttributeError:
    source_coordinates = [16.22835159301758, 48.16608541901253]


def generateRandomPoint(coords=source_coordinates, variance_degree=1):
    variance_degree = abs(variance_degree)
    return Point(list(map(lambda x: x + random.uniform(-variance_degree, variance_degree), coords)))
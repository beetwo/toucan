from django.test import TestCase
from django.contrib.gis.geos import Point

from .models import Location
from .factory import OrganisationFactory

class LocationFieldSpatialTest(TestCase):

    def setUp(self):
        self.org = OrganisationFactory(name='test organisation')


    def test_location_creation(self):
        vals = {
            'city': 'Vienna',
            'location': 'POINT(48.59727118 16.58460436)',
        }

        obj = Location.objects.create(org=self.org, **vals)

        self.assertEqual(obj.city, vals['city'])
        self.assertEqual(obj.location, Point(48.59727118, 16.58460436))

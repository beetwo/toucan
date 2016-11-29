from django.test import TestCase
from django.core.urlresolvers import reverse

from .urls import urlpatterns


class RenderHelpPagesTestCase(TestCase):

    def setUp(self):
        self.urls = []
        for up in urlpatterns:
            self.urls.append(
                reverse('help:' + up.name)
            )

    def testRender(self):
        for url in self.urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, 200)
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from django.core.urlresolvers import reverse
from django.test import TestCase

from toucan.organisations.models import Organisation
from toucan.issues.models import Issue, IssueType


class ReadApiTestCase(TestCase):

    def setUp(self):
        self.org = Organisation.objects.create(
            name='TestingOrganisation',
            short_name='testing_org'
        )
        self.user = User.objects.create(username='testUser')
        self.org.add_member(self.user)
        self.issue_type = IssueType.objects.create(
            name='TestIssueType',
            slug='test_issue_type'
        )
        self.issue = Issue.objects.create(
            title='This being a test issue',
            description='''
            This is the description of the test issue.
            ''',
            point=Point((16, 48)),
            organisation=self.org,
            created_by=self.user,
        )
        self.issue.issue_types.add(self.issue_type)

    def testIssueList(self):
        self.assertTrue(True)

class UserNameReverseUrlTest(TestCase):

    def resolve(self, username):
        return reverse('toucan_api:user_detail', kwargs={'username': username})

    def testUsernames(self):
        self.resolve('tester')
        self.resolve('tester@example.com')
        self.resolve('tester-mc-test')

from datetime import timedelta

from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone

from organisations.factory import OrganisationFactory
from .models import ToucanInvitation, INVITATION_VALID


class ToucanInvitationTest(TestCase):

    def setUp(self):
        self.inviter = User.objects.create(username='test_inviter')
        self.org = OrganisationFactory(name='InvitersOrganisation')
        self.org.add_owner(self.inviter)
        self.invitation = ToucanInvitation.objects.create(
            invited_by=self.inviter,
            email='tester@example.com',
            organisation=self.org,
        )


    def testActiveManager(self):
        self.assertTrue(
            self.invitation in ToucanInvitation.active.all()
        )

    def testIsActiveAtTime(self):
        self.assertTrue(
            self.invitation.is_active(at=timezone.now() + INVITATION_VALID - timedelta(hours=1))
        )

    def testIsInactiveAtDate(self):
        self.assertFalse(self.invitation.is_active(at=timezone.now() + INVITATION_VALID + timedelta(hours=1)))

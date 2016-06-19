from django.test import TestCase
from django.contrib.auth.models import User
from .models import Profile


class UserCreationSignalTest(TestCase):

    def setUp(self):
        self.user = User.objects.create(username='testuser')

    def testUserProfileCreation(self):
        self.assertIsInstance(self.user.profile, Profile)



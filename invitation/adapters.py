# coding=utf-8
from allauth.account.adapter import DefaultAccountAdapter

class InvitationAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        return False
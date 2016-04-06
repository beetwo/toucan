'''
All production settings for allauth go here

http://django-allauth.readthedocs.org/en/latest/configuration.html
'''

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'

ACCOUNT_SIGNUP_FORM_CLASS = 'user_profile.forms.UserProfileSignupForm'

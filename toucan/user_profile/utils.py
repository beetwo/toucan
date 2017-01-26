from phonenumber_field.phonenumber import PhoneNumber

from .models import Profile


def has_valid_phone_number(user):
    """Return a boolean signalling if the user has a valid telephone number associated with his account"""

    try:
        profile = user.profile
    except Profile.DoesNotExist:
        return False

    if profile and isinstance(profile.phone_number, PhoneNumber):
        return True

    return False

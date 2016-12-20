def can_invite_to_org(user, org):
    from .models import Membership
    if user.is_authenticated:
        if user.is_superuser:
            return True
        try:
            Membership.objects.get(user=user, org=org, active=True, role__gte=5)
            return True
        except Membership.DoesNotExist:
            pass

    return False

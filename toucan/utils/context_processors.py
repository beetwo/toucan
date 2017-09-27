from django.conf import settings


def analytics(request):
    key = 'GA_TRACKING_ID'
    tracking_id = getattr(settings, key, False)
    return {
        'analytics': {
            key: tracking_id
        }
    }

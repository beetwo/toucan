from django.conf import settings


def get_url_for_geographic_notification(ns):
    token = getattr(settings, 'MAPBOX_TOKEN', False)
    if not token:
        return ''

    center = ns.point.coords
    url = "https://api.mapbox.com/styles/v1/mapbox/light-v9/static/{lon},{lat},12/{x}x{y}?access_token={token}"
    return url.format(**{
        "token": token,
        "lon": center[0],
        "lat": center[1],
        "x": 138,
        "y": 138
    })

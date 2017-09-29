from django.conf import settings


def get_url_for_geographic_notification(ns):
    token = getattr(settings, 'MAPBOX_TOKEN', False)
    if not token:
        return ''
    # print(ns)
    url = "https://api.mapbox.com/styles/v1/mapbox/light-v9/static/{lon},{lat},12/{x}x{y}?access_token={token}"
    return url.format(**{
        "token": token,
        "lon": -122.4241,
        "lat": 37.78,
        "x": 138,
        "y": 138
    })

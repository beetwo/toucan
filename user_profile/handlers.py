from .models import NotificationSettings
from django.contrib.gis.db.models.functions import Distance
from django.db.models import F, Count


def issue_created(*args, **kwargs):
    created = kwargs.get('created')
    issue = kwargs['instance']

    if not created:
        return

    # TODO: this is too costly and probably just plain stupid
    # some reading material:
    # http://gis.stackexchange.com/questions/176735/geodjango-distance-filter-based-on-database-column
    # http://stackoverflow.com/questions/9547069/geodjango-distance-filter-with-distance-value-stored-within-model-query
    # http://postgis.refractions.net/docs/ST_DWithin.html
    notification_qs = NotificationSettings.objects\
        .annotate(
            distance=Distance('point', issue.point),
            org_count=Count('organisations'),
            type_count=Count('issue_types')
        )\
        .filter(
            enabled=True,
            distance__lte=F('point_radius') * 1000
        )\
        .order_by('-created')

    notifications_to_send = []

    for notification in notification_qs:

        # filter by organisations
        if notification.org_count > 0 and issue.organisation not in notification.organisations.all():
            continue

        # filter by issue types
        if notification.type_count > 0 and issue.issue_type not in notification.issue_types.all():
            continue

        notifications_to_send.append(notification)

    for n in notifications_to_send:
        n.send(issue)


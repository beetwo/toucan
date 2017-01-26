from channels.routing import route

from toucan.notifications.consumers import parse_mentions, send_comment_notification

channel_routing = [
    route("notifications.parse_mentions", parse_mentions),
    route("notifications.send_comment_notification", send_comment_notification)
]

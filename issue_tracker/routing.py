from channels.routing import route
from notifications.consumers import ws_message, ws_add, ws_disconnect

channel_routing = [
    route("websocket.receive", ws_message),
    route("websocket.connect", ws_add),
    route("websocket.disconnect", ws_disconnect),
]

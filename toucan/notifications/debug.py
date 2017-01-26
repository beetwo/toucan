from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib import messages


def generate_notifications(request):

    for name, level in messages.DEFAULT_LEVELS.items():
        messages.add_message(
            request,
            level,
            'This is a message with level %s' % name.lower()
        )

    return HttpResponseRedirect(reverse('home'))
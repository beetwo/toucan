from django.core.urlresolvers import reverse

from contact_form.views import ContactFormView
from braces.views import FormValidMessageMixin

class HelpPage(FormValidMessageMixin, ContactFormView):

    template_name = 'help/start.html'

    form_valid_message = 'Your message has been sent.'

    def get_initial(self):
        if self.request.user.is_authenticated:
            user = self.request.user
            return {
                'email': user.email,
                'name': user.username
            }
        return {}

    def get_success_url(self):
        return reverse('help:start')
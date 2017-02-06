from django.views.generic import TemplateView


class MultiTemplateView(TemplateView):
    template_names = None

    def get_template_names(self):
        if self.template_names is None:
            # restore default behaviour
            return super().get_template_names()
        else:
            return self.template_names

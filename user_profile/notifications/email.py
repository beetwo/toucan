from django.template.loader import get_template

from . import BaseNotification

class EmailNotification(BaseNotification):

    def get_message(self):
        template = get_template('user_profile/notification/email/issue.txt')
        return template.render({
            'issue': self.issue,
            'notification_setting': self.notification
        })


    def send_issue_notification(self):
        self.notification.user.email_user(
            'New Issue #%s created: %s' % (self.issue.pk, self.issue.title),
            self.get_message()
        )
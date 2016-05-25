import logging

from django.contrib.auth import get_user_model
from django.db.models import Q, ObjectDoesNotExist
from channels import Channel
from issues.models import IssueComment
from organisations.models import Organisation, Membership

User = get_user_model()

logger = logging.getLogger(__name__)


def parse_mentions(message):

    try:
        comment = IssueComment.objects.get(pk=message.content.get('pk'))
    except IssueComment.DoesNotExist:
        logger.error('Comment not found', message)
        return

    mentions = comment.get_mentions()
    users = User.objects.filter(username__in=mentions).distinct()
    orgs = Organisation.objects.filter(short_name__in=mentions).distinct()

    user_ids = set()

    channel = Channel('notifications.send_comment_notification')

    for u in users:
        user_ids.add(u.pk)
        channel.send({
            'comment_pk': comment.pk,
            'user_pk': u.pk,
            'user_mention': True
        })

    for org in orgs:
        memberships = Membership.objects\
            .filter(org=org)\
            .exclude(Q(mention_notification='') | Q(user_id__in=user_ids))\
            .select_related('user')

        for m in memberships:
            u = m.user
            if u.pk not in user_ids:
                user_ids.add(u.pk)
                channel.send({
                    'comment_pk': comment.pk,
                    'user_pk': u.pk,
                    'organisation_mention': True,
                    'organisation_pk': org.pk
                })

    return


def send_comment_notification(msg):

    try:
        user = User.objects.get(pk=msg.content.get('user_pk'))
        comment = IssueComment.objects.select_related('issue').get(pk=msg.content.get('comment_pk'))
        issue = comment.issue
        logger.info(
            'Sending mention notification from comment %d to user %s (pk: %d)'
            % (comment.pk, user.username, user.pk)
        )
        user.email_user(
            subject='You were mentioned: %s' % issue.title,
            message='''
                This mail is to tell you that you (or one of your organisations) were mentioned in a recent comment:

                -----------------
                %s
                -----------------
                The corresponding issue is:
                %s

                You can view the comment and the issue here:
                %s
                ''' % (
                    comment.get_comment(),
                    comment.issue.title,
                    'https://b2it.brickwall.at/issue/' + str(comment.issue.pk)
                )
        )
    except ObjectDoesNotExist:
        logger.error('Comment notification could not be resolved.')
        return


    print(msg, msg.content)


import logging

from channels import Channel
from django.contrib.auth import get_user_model
from django.db.models import ObjectDoesNotExist

from ..issues.models import IssueComment
from ..organisations.models import Organisation
from ..user_profile.models import Profile
from .notifications import send_email_notification, send_sms_notification

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

    # handle user name mentions
    for u in users:
        user_ids.add(u.pk)
        channel.send({
            'comment_pk': comment.pk,
            'user_pk': u.pk,
            'user_mention': True
        })

    # handle org name mentions
    for org in orgs:
        profiles = Profile.objects.filter(user__membership__org=org)\
            .exclude(user_id__in=user_ids)\
            .select_related('user')

        for p in profiles:
            u = p.user
            if u.pk not in user_ids:
                user_ids.add(u.pk)
                channel.send({
                    'comment_pk': comment.pk,
                    'user_pk': u.pk,
                    'organisation_mention': True,
                    'organisation_pk': org.pk,
                })
    return


def send_comment_notification(channel_message):

    msg = {
        'user_mention': False,
        'organisation_mention': False
    }

    msg.update(channel_message.content)
    comment_id = msg.get('comment_pk')
    user_pk = msg.get('user_pk')

    is_user_mention = msg.get('user_mention')
    is_org_mention = msg.get('organisation_mention')
    assert(is_user_mention != is_org_mention)

    try:
        user = User.objects.select_related('profile').get(pk=user_pk)
        profile = user.profile
        comment = IssueComment.objects.select_related('issue').get(pk=comment_id)
    except ObjectDoesNotExist:
        logger.error('Comment notification could not be resolved.')
        return

    # All resolved, send notifications
    logger.info('Processing notification for user %s (%d) and comment id:%d' % (user.username, user.pk, comment_id))

    # resolve the message type or return if notifications are disabled
    msg_type = None

    # filter out users who have disabled user/org notifications
    if is_user_mention:
        if not profile.user_mention_notification:
            logger.info('Skipping notification because user has disabled user mention notifications')
            return
        else:
            msg_type = profile.user_mention_notification

    if is_org_mention:
        if not profile.org_mention_notification:
            logger.info('Skipping notification because user has disabled organisation mention notifications')
            return
        else:
            msg_type = profile.org_mention_notification

    assert(msg_type is not None)

    issue = comment.issue

    logger.info(
        'Sending mention notification from comment %d to user %s (pk: %d), message type is %s'
        % (comment.pk, user.username, user.pk, msg_type)
    )

    issue_url = comment.issue.get_absolute_url()

    if msg_type == 'email':

        if is_user_mention:
            msg = 'you '
        elif is_org_mention:
            msg = 'your organisation'

        send_email_notification(
            user.email,
            'You were mentioned: %s' % issue.title,
            '''
                This mail is to tell you that %s were mentioned in a recent comment:

                -----------------
                %s
                -----------------
                The corresponding issue is:
                %s

                You can view the comment and the issue here:
                %s
                ''' % (
                msg,
                comment.get_comment(),
                comment.issue.title,
                issue_url
            )

        )
    elif msg_type == 'sms':
        if is_org_mention:
            msg = 'Your organisation was mentioned in a recent comment: \n'
        elif is_user_mention:
            msg = 'You were mentioned in a recent comment: \n'

        msg = msg + issue_url
        send_sms_notification(
            user.profile.phone_number.as_e164,
            msg
        )



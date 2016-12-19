from django.contrib.auth import get_user_model
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from rest_framework.reverse import reverse
from issues.models import Issue, IssueComment, IssueType, IssueStatus
from organisations.models import Organisation, Membership
from user_profile.models import NotificationSettings
from toucan.media.models import ImageFile, MediaFile
from channels import Channel


class NotificationAreaSerializer(GeoFeatureModelSerializer):

    class Meta:
        model = NotificationSettings
        geo_field = 'point'
        fields = [
            'id',
            'point',
            'point_radius',
        ]


class OrganisationSerializer(serializers.ModelSerializer):

    logo = serializers.ImageField()
    profile_url = serializers.SerializerMethodField()

    def get_profile_url(self, org):

        return reverse(
            'organisations:organisation_detail',
            kwargs={'org_id': org.pk},
            request=self.context['request']
        )

    class Meta:
        model = Organisation
        fields = [
            'name',
            'short_name',
            'logo',
            'profile_url'
        ]


class MembershipSerializer(serializers.ModelSerializer):

    org = OrganisationSerializer(many=False, read_only=True)

    class Meta:
        model = Membership
        fields = ['org']


class UserSerializer(serializers.ModelSerializer):

    url = serializers.SerializerMethodField()
    html_url = serializers.SerializerMethodField()

    def get_url(self, user):
        return reverse(
            'issue_tracker_api:user_detail',
            kwargs={
                'username': user.username
            },
            request=self.context['request']
        )

    def get_html_url(self, user):
        return reverse(
            'user_profile:public_profile',
            kwargs={
                'username': user.username
            },
            request=self.context['request']
        )

    class Meta:
        model = get_user_model()
        fields = [
            'username',
            'id',
            'url',
            'html_url'
        ]


class FullUserSerializer(serializers.ModelSerializer):

    membership = MembershipSerializer(many=False, read_only=True)

    class Meta:
        model = get_user_model()
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'membership'
        ]


class IssueTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = IssueType
        fields = [
            'slug',
            'name',
        ]


class SimpleImageSerializer(serializers.ModelSerializer):

    thumbnail_url = serializers.SerializerMethodField()

    def get_thumbnail_url(self, image):
        return image.thumbnail.url

    class Meta:
        model = ImageFile
        fields = [
            'pk',
            'image',
            'thumbnail_url'
        ]


class CommentSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            request = kwargs['context']['request']
        except KeyError:
            return

        user = request.user if request.user.is_authenticated else None
        choices = list(MediaFile.objects.filter(uploader=user, comment__isnull=True).values_list('pk', flat=True))
        if request.method in ['POST', 'PATCH']:
            self.fields['attachments'] = serializers.MultipleChoiceField(
                choices=choices,
                required=False,
                write_only=True
            )

    user = UserSerializer(read_only=True)

    comment = serializers.SerializerMethodField()

    toggleState = serializers.BooleanField(write_only=True, required=False)

    attachments = SimpleImageSerializer(many=True, read_only=True, source='get_attachments')

    def get_comment(self, comment):
        return comment.get_comment()

    class Meta:
        model = IssueComment
        fields = [
            'id',
            'user',
            'created',
            'modified',
            'draft_struct',
            'comment',
            'toggleState',
            'attachments',
        ]
        read_only_fields = [
            'id',
            'user',
            'created',
            'modified',
        ]

    def create(self, validated_data):

        toggle = validated_data.pop('toggleState', False)
        attachments = validated_data.pop('attachments', [])
        comment = super().create(validated_data)

        # link the mediafiles to the comment
        MediaFile.objects.filter(
            comment__isnull=True,
            uploader=comment.user,
            pk__in=attachments).update(comment=comment.pk)

        # open or close as a side effect
        if toggle:
            cs = comment.issue.status
            status = 'open' if cs == 'closed' else 'closed'
            IssueStatus.objects.create(
                user=comment.user,
                issue=comment.issue,
                status=status
            )

        msg = {
            'pk': comment.pk
        }

        Channel('notifications.parse_mentions').send(msg)
        return comment


class StatusSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = IssueStatus
        fields = [
            'id',
            'created',
            'status',
            'user',
        ]
        read_only_fields = [
            'id',
            'user',
            'created'
        ]


class IssueSerializer(GeoFeatureModelSerializer):

    url = serializers.HyperlinkedIdentityField(
        view_name='issue_tracker_api:issue_detail',
        lookup_url_kwarg='issue_id',
        lookup_field='pk'
    )

    issue_types = IssueTypeSerializer(many=True, read_only=True)

    comment_count = serializers.IntegerField(read_only=True)

    organisation = OrganisationSerializer()

    class Meta:
        model = Issue
        geo_field = 'point'
        fields = [
            # model fields
            'id',
            'title',
            'priority',
            'visibility',
            'status',
            'created',
            # defined fields
            'url',
            'issue_types',
            'comment_count',
            'organisation',
        ]


class FullIssueSerializer(IssueSerializer):

    comment_url = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    status_url = serializers.SerializerMethodField()
    status_changes = StatusSerializer(many=True, read_only=True)

    creator = UserSerializer(read_only=True, source='created_by')
    organisation = OrganisationSerializer()

    users = UserSerializer(many=True, read_only=True)

    def get_comment_url(self, issue):
        return reverse(
            'issue_tracker_api:issue_comments',
            kwargs={'issue_id': issue.pk},
            request=self.context['request']
        )

    def get_status_url(self, issue):
        return reverse(
            'issue_tracker_api:issue_status',
            kwargs={'issue_id': issue.pk},
            request=self.context['request']
        )

    class Meta:
        model = Issue
        geo_field = 'point'

        fields = IssueSerializer.Meta.fields + [
            'description',
            'description_format',
            'comment_url',
            'comments',
            'status_url',
            'status_changes',
            'creator',
            'organisation',
            'users',
        ]

        readonly_fields = [
            'description_format',
        ]


class OrgMentionSerializer(serializers.ModelSerializer):

    name = serializers.CharField()
    slug = serializers.CharField(source='short_name')

    class Meta:
        model = Organisation
        fields = ['name', 'slug']


class UserMentionSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()
    slug = serializers.CharField(source='username')

    def get_name(self, u):
        return u.username

    class Meta:
        model = UserSerializer.Meta.model
        fields = ['name', 'slug']

class ImageUploadSerializer(serializers.ModelSerializer):

    class Meta:
        model = ImageFile
        fields = [
            'pk',
            'image'
        ]
from django.contrib.auth import get_user_model
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from rest_framework.reverse import reverse

from issues.models import Issue, IssueComment, IssueType, IssueStatus
from organisations.models import Organisation, Membership
from user_profile.models import NotificationSettings
from toucan.media.models import ImageFile
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

    def get_url(self, user):
        return reverse(
            'issue_tracker_api:user_detail',
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
            'url'
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


class CommentSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    comment = serializers.SerializerMethodField()

    toggleState = serializers.BooleanField(write_only=True, required=False)

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
            'toggleState'
        ]
        read_only_fields = [
            'id',
            'user',
            'created',
            'modified',
        ]

    def create(self, validated_data):

        toggle = validated_data.pop('toggleState', False)
        comment = super().create(validated_data)

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
            'image'
        ]
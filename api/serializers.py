from django.contrib.auth import get_user_model
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from rest_framework.reverse import reverse

from issues.models import Issue, IssueComment, IssueType, IssueStatus
from issues.utils import draft_struct_to_comment
from organisations.models import Organisation

from channels import Channel


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = [
            'username',
            'id'
        ]


class OrganisationSerializer(serializers.ModelSerializer):

    logo = serializers.ImageField()

    class Meta:
        model = Organisation
        fields = [
            'name',
            'short_name',
            'logo'
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

    close = serializers.BooleanField(write_only=True, required=False)
    open = serializers.BooleanField(write_only=True, required=False)

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
            'close',
            'open'
        ]
        read_only_fields = [
            'id',
            'user',
            'created',
            'modified',
        ]

    def create(self, validated_data):
        close = validated_data.pop('close', False)
        open = validated_data.pop('open', False)
        comment = super().create(validated_data)

        current_status = comment.issue.status
        # open or close as a side effect
        if close and current_status != 'closed':
            IssueStatus.objects.create(
                user=comment.user,
                issue=comment.issue,
                status='closed'
            )

        if open and current_status != 'open':
            IssueStatus.objects.create(
                user=comment.user,
                issue=comment.issue,
                status='open'
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

    issue_url = serializers.HyperlinkedIdentityField(
        view_name='issue_tracker_api:issue_detail',
        lookup_url_kwarg='issue_id',
        lookup_field='pk'
    )

    issue_type = IssueTypeSerializer(read_only=True)

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
            'issue_url',
            'issue_type',
            'comment_count',
            'organisation',
        ]


class FullIssueSerializer(IssueSerializer):

    issue_type = IssueTypeSerializer(read_only=True)

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
            'issue_type',
            'comment_url',
            'comments',
            'status_url',
            'status_changes',
            'creator',
            'organisation',
            'users',
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


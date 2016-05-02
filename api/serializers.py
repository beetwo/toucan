from issues.models import Issue, IssueComment, IssueType, IssueStatus
from django.contrib.auth import get_user_model
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from rest_framework.reverse import reverse


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = [
            'username',
            'id'
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

    class Meta:
        model = IssueComment
        fields = [
            'id',
            'user',
            'comment',
            'created',
            'modified',
        ]
        read_only_fields = [
            'id',
            'user',
            'created',
            'modified',
        ]


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

    class Meta:
        model = Issue
        geo_field = 'point'
        fields = [
            'id',
            'issue_url',
            'title',
            'priority',
            'visibility',
            'comment_count',
            'issue_type',
            'status'
        ]


class FullIssueSerializer(IssueSerializer):

    comment_url = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    status_url = serializers.SerializerMethodField()
    status_changes = StatusSerializer(many=True, read_only=True)

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
        fields = [
            'id',
            'point',
            'title',
            'description',
            'status',
            'priority',
            'visibility',
            'comment_url',
            'status_url',
            'comments',
            'status_changes',
        ]



from issues.models import Issue, IssueComment
from django.contrib.auth import get_user_model
from rest_framework_gis.serializers import GeoFeatureModelSerializer, GeometrySerializerMethodField
from rest_framework import serializers
from rest_framework.reverse import reverse


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = [
            'username',
            'id'
        ]


class CommentSerializer(serializers.ModelSerializer):

    created_by = UserSerializer(read_only=True)

    class Meta:
        model = IssueComment
        fields = [
            'id',
            'created_by',
            'comment',
            'created',
            'modified',
        ]
        read_only_fields = [
            'id',
            'created_by',
            'created',
            'modified',
        ]


class IssueSerializer(GeoFeatureModelSerializer):

    issue_url = serializers.HyperlinkedIdentityField(
        view_name='issue_tracker_api:issue_detail',
        lookup_url_kwarg='issue_id',
        lookup_field='pk'
    )

    comment_count = serializers.IntegerField(read_only=True)

    gis_location = GeometrySerializerMethodField()

    def get_gis_location(self, obj):
        return obj.gis_location

    class Meta:
        model = Issue
        geo_field = 'gis_location'
        fields = [
            'id',
            'issue_url',
            'gis_location',
            'title',
            'priority',
            'visibility',
            'comment_count',
        ]


class FullIssueSerializer(IssueSerializer):

    comments = CommentSerializer(many=True, read_only=True)

    detail_url = serializers.SerializerMethodField()

    def get_detail_url(self, issue):
        return reverse('issues:issue_detail', kwargs={'issue_id': issue.pk}, request=self.context['request'])

    comment_url = serializers.SerializerMethodField()

    def get_comment_url(self, issue):
        return reverse('issue_tracker_api:issue_comments', kwargs={'issue_id': issue.pk}, request=self.context['request'])


    class Meta:
        model = Issue
        geo_field = 'gis_location'
        fields = [
            'id',
            'gis_location',
            'title',
            'description',
            'priority',
            'visibility',
            'detail_url',
            'comment_url',
            'comments',
        ]

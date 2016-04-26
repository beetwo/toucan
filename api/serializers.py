from issues.models import Issue, IssueComment, IssueType
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


class IssueTypeSerializer(serializers.ModelSerializer):

    svg = serializers.SerializerMethodField()

    def get_svg(self, it):
        return it.svg_icon.url if it.svg_icon else None

    class Meta:
        model = IssueType
        fields = [
            'slug',
            'name',
            'svg'
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

    issue_type = IssueTypeSerializer(read_only=True)

    comment_count = serializers.IntegerField(read_only=True)


    class Meta:
        model = Issue
        geo_field = 'point'
        fields = [
            'id',
            'issue_url',
            # 'gis_location',
            'title',
            'priority',
            'visibility',
            'comment_count',
            'issue_type'
        ]


class FullIssueSerializer(IssueSerializer):

    comment_url = serializers.SerializerMethodField()

    def get_comment_url(self, issue):
        return reverse('issue_tracker_api:issue_comments', kwargs={'issue_id': issue.pk}, request=self.context['request'])


    class Meta:
        model = Issue
        geo_field = 'point'
        fields = [
            'id',
            'point',
            'title',
            'description',
            'priority',
            'visibility',
            'comment_url',
        ]



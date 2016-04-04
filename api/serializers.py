from issues.models import Issue
from rest_framework_gis.serializers import GeoFeatureModelSerializer, GeometrySerializerMethodField
from rest_framework import serializers


class IssueSerializer(GeoFeatureModelSerializer):

    issue_url = serializers.HyperlinkedIdentityField(
        view_name='issue_tracker_api:issue_detail',
        lookup_url_kwarg='issue_id',
        lookup_field='pk'
    )

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
        ]


class FullIssueSerializer(IssueSerializer):

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
        ]
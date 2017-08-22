from channels import Channel
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.reverse import reverse
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from ..issues.models import Issue, IssueComment, IssueType, IssueStatus
from ..media.models import ImageFile, MediaFile
from ..organisations.models import Organisation, Membership, Location
from ..user_profile.models import NotificationSettings


class NotificationAreaSerializer(GeoFeatureModelSerializer):

    class Meta:
        model = NotificationSettings
        geo_field = 'point'
        fields = [
            'id',
            'point',
            'point_radius',
        ]


class OrganisationLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = [
            'id',
            'city',
            'location'
        ]


class OrganisationSerializer(serializers.ModelSerializer):

    logo = serializers.ImageField()
    locations = OrganisationLocationSerializer(many=True, read_only=True, source='location_set')

    class Meta:
        model = Organisation
        fields = [
            'id',
            'name',
            'short_name',
            'logo',
            'locations'
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
            'toucan_api:user_detail',
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

    # membership = MembershipSerializer(many=False, read_only=True)

    class Meta:
        model = get_user_model()
        fields = [
            'username',
            'first_name',
            'last_name',
            # 'membership'
        ]


class OrgMembershipSerializer(serializers.ModelSerializer):

    user = FullUserSerializer()
    role = serializers.SerializerMethodField()

    def get_role(self, membership):
        return membership.get_role_display()

    class Meta:
        model = Membership
        fields = [
            'role',
            'user'
        ]

class FullOrganisationSerializer(OrganisationSerializer):

    members = serializers.SerializerMethodField()

    def get_members(self, org):
        members = org.membership_set.filter(active=True).select_related('user')
        return OrgMembershipSerializer(members, many=True).data

    class Meta(OrganisationSerializer.Meta):
        fields = OrganisationSerializer.Meta.fields + [
            "members",
            "description",
            "homepage"
        ]


class PublicUserSerializer(UserSerializer):

    membership = MembershipSerializer(many=False, read_only=True)

    class Meta:
        model = UserSerializer.Meta.model
        fields = UserSerializer.Meta.fields + [
            'membership',
            'first_name',
            'last_name',
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
        try:
            return image.thumbnail.url
        except FileNotFoundError:
            return None

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
        choices = list(MediaFile.objects.filter(
            uploader=user, comment__isnull=True).values_list('pk', flat=True))
        if request.method in ['POST', 'PATCH']:
            self.fields['attachments'] = serializers.MultipleChoiceField(
                choices=choices,
                required=False,
                write_only=True
            )

    user = UserSerializer(read_only=True)

    comment = serializers.SerializerMethodField()

    attachments = SimpleImageSerializer(
        many=True, read_only=True, source='get_attachments')

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
            'attachments',
        ]
        read_only_fields = [
            'id',
            'user',
            'created',
            'modified',
        ]

    def create(self, validated_data):
        print(validated_data)
        attachments = validated_data.pop('attachments', [])
        comment = super().create(validated_data)

        # link the mediafiles to the comment
        MediaFile.objects.filter(
            comment__isnull=True,
            uploader=comment.user,
            pk__in=attachments).update(comment=comment.pk)

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
        view_name='toucan_api:issue_detail',
        lookup_url_kwarg='issue_id',
        lookup_field='pk'
    )

    issue_types = IssueTypeSerializer(many=True, read_only=True)

    comment_count = serializers.IntegerField(read_only=True)

    organisation = OrganisationSerializer()

    status = serializers.SerializerMethodField()

    pick_up = serializers.BooleanField(source='pick_up_flag')

    def get_status(self, obj):
        return obj.get_current_status_display()

    class Meta:
        model = Issue
        geo_field = 'point'
        fields = [
            # model fields
            'id',
            'title',
            'point',
            # 'priority',
            # 'visibility',
            'status',
            # 'get_status_display',
            'created',
            # defined fields
            'url',
            'issue_types',
            'comment_count',
            'organisation',
            'pick_up'
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
            'toucan_api:issue_comments',
            kwargs={'issue_id': issue.pk},
            request=self.context['request']
        )

    def get_status_url(self, issue):
        return reverse(
            'toucan_api:issue_status',
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

from django.contrib.auth import get_user_model
from django.db.models import Count, Prefetch
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy as _


from drf_multiple_model.views import ObjectMultipleModelAPIView, FlatMultipleModelAPIView
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.reverse import reverse


from ..issues.models import Issue, IssueComment, IssueStatus, IssueType
from ..organisations.models import Organisation
from ..user_profile.models import NotificationSettings

from .serializers import IssueSerializer, FullIssueSerializer, CommentSerializer, \
    UserSerializer, StatusSerializer, OrgMentionSerializer, UserMentionSerializer, \
    NotificationAreaSerializer, FullUserSerializer, ImageUploadSerializer, \
    PublicUserSerializer, FullOrganisationSerializer, OrganisationSerializer

User = get_user_model()


class UserInformationApi(APIView):

    def get(self, request, format=None):
        response = {
            'user': None,
            'notificationAreas': [],
            'canComment': False,
            'links': [
                {
                    'key': 'settings',
                    'name': _('Settings and Profile'),
                    'url': reverse('user_profile:personal_profile', request=request)
                },
                {
                    'key': 'logout',
                    'name': _('Logout'),
                    'url': reverse('account_logout', request=request)
                },
                {
                    'key': 'support',
                    'name': _('Support'),
                    'url': reverse('help:start', request=request)
                }
            ]
        }

        if request.user.is_authenticated():
            response.update({
                'user': UserSerializer(request.user, context={'request': request}).data,
                'notificationAreas': NotificationAreaSerializer(
                    NotificationSettings.objects.filter(user=request.user), many=True
                ).data,
                'canComment': True
            })
        if request.user.is_staff:
            response['links'].insert(1, {
                'key': 'admin',
                'name': _('Administration Interface'),
                'url': reverse('admin:index', request=request)
            })

        return Response(response)



class BaseIssueMixin(object):

    def get_queryset(self):
        qs = Issue.objects\
            .annotate(
                comment_count=Count('comments')
            )
        return qs


class LocationApi(BaseIssueMixin, ListAPIView):

    def get_queryset(self):
        return Issue.objects.select_related('organisation', 'location')\
            .prefetch_related(Prefetch('issue_types', queryset=IssueType.objects.all()))\
            .annotate(comment_count=Count('comments'))

    serializer_class = IssueSerializer


class IssueView(BaseIssueMixin, RetrieveAPIView):

    serializer_class = FullIssueSerializer
    lookup_url_kwarg = 'issue_id'



class IssueCommentView(ListCreateAPIView):

    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    @property
    def issue(self):
        return get_object_or_404(Issue, pk=self.kwargs['issue_id'])

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, issue=self.issue)

    def get_queryset(self):
        return IssueComment.objects.filter(issue=self.issue)


class IssueStatusView(ListCreateAPIView):

    serializer_class = StatusSerializer
    permission_classes = [IsAuthenticated]

    @property
    def issue(self):
        return get_object_or_404(Issue, pk=self.kwargs['issue_id'])

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, issue=self.issue)

    def get_queryset(self):
        return IssueStatus.objects.filter(issue=self.issue)


class CommentDetailView(RetrieveAPIView):
    serializer_class = CommentSerializer
    queryset = IssueComment.objects.all()


class MentionView(FlatMultipleModelAPIView):

    def get_queryList(self):
        query = self.request.query_params.get('search', '')

        return (
            (User.objects.filter(username__istartswith=query), UserMentionSerializer),
            (Organisation.objects.filter(short_name__istartswith=query), OrgMentionSerializer)
        )


class UserOrOrgDetailView(ObjectMultipleModelAPIView):

    def get_queryList(self):
        unique_name = self.kwargs.get('name')
        return (
            (User.objects.filter(username=unique_name), PublicUserSerializer),
            (Organisation.objects.filter(short_name=unique_name), FullOrganisationSerializer)
        )


class UserDetailView(RetrieveAPIView):
    serializer_class = FullUserSerializer
    lookup_url_kwarg = 'username'
    lookup_field = 'username'

    queryset = User.objects.all()


class UserSearch(ListAPIView):

    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.select_related('profile').all()
        username = self.request.query_params.get('search', '')

        if len(username) < 3:
            raise ValidationError({
                'search': 'This endpoint expects a search parameter with a length longer than 3.'
            })

        return queryset.filter(username__istartswith=username)


class ImageCreateView(CreateAPIView):

    serializer_class = ImageUploadSerializer

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)


class OrganisationListView(ListAPIView):
    serializer_class = OrganisationSerializer
    queryset = Organisation.objects.all().prefetch_related('location_set')


class OrganisationDetailView(RetrieveAPIView):
    queryset = Organisation.objects.all()
    serializer_class = FullOrganisationSerializer
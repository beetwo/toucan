from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import ValidationError

from drf_multiple_model.views import MultipleModelAPIView

from issues.models import Issue, IssueComment, IssueStatus
from organisations.models import Organisation
from .serializers import IssueSerializer, FullIssueSerializer, CommentSerializer, \
    UserSerializer, StatusSerializer, OrgMentionSerializer, UserMentionSerializer

User = get_user_model()


class LocationApi(ListAPIView):
    queryset = Issue.objects.filter(point__isnull=False).annotate(comment_count=Count('comments'))
    serializer_class = IssueSerializer


class IssueView(RetrieveAPIView):

    queryset = LocationApi.queryset
    serializer_class = FullIssueSerializer
    lookup_url_kwarg = 'issue_id'


class IssueCommentView(ListCreateAPIView):

    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @property
    def issue(self):
        return get_object_or_404(Issue, pk=self.kwargs['issue_id'])

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, issue=self.issue)

    def get_queryset(self):
        return IssueComment.objects.filter(issue=self.issue)


class IssueStatusView(ListCreateAPIView):

    serializer_class = StatusSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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


class MentionView(MultipleModelAPIView):
    flat = True

    def get_queryList(self):
        query = self.request.query_params.get('search', '')

        return (
            (User.objects.filter(username__istartswith=query), UserMentionSerializer),
            (Organisation.objects.filter(short_name__istartswith=query), OrgMentionSerializer)
        )




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


from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import ValidationError
from issues.models import Issue, IssueComment

from .serializers import IssueSerializer, FullIssueSerializer, CommentSerializer, UserSerializer

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
        serializer.save(created_by=self.request.user, issue=self.issue)

    def get_queryset(self):
        return IssueComment.objects.filter(issue=self.issue)


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


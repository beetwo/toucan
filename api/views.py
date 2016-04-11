from django.db.models import Count
from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializers import IssueSerializer, FullIssueSerializer, CommentSerializer
from issues.models import Issue, IssueComment
from braces.views import CsrfExemptMixin

class LocationApi(ListAPIView):
    queryset = Issue.objects.filter(location__isnull=False).annotate(comment_count=Count('comments'))
    serializer_class = IssueSerializer


class IssueView(RetrieveAPIView):

    queryset = LocationApi.queryset
    serializer_class = FullIssueSerializer
    lookup_url_kwarg = 'issue_id'


class IssueCommentView(CsrfExemptMixin, ListCreateAPIView):

    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @property
    def issue(self):
        return Issue.objects.get(pk=self.kwargs['issue_id'])

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, issue=self.issue)

    def get_queryset(self):
        return IssueComment.objects.filter(issue=self.issue)

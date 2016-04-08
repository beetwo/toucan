from django.db.models import Count
from rest_framework.generics import ListAPIView
from rest_framework.generics import RetrieveAPIView

from .serializers import IssueSerializer, FullIssueSerializer
from issues.models import Issue


class LocationApi(ListAPIView):
    queryset = Issue.objects.filter(location__isnull=False).annotate(comment_count=Count('comments'))
    serializer_class = IssueSerializer


class IssueView(RetrieveAPIView):
    queryset = LocationApi.queryset
    serializer_class = FullIssueSerializer
    lookup_url_kwarg = 'issue_id'

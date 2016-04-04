from rest_framework.generics import ListAPIView
from rest_framework.generics import RetrieveAPIView
from .serializers import IssueSerializer, FullIssueSerializer
from issues.models import Issue


class LocationApi(ListAPIView):
    queryset = Issue.objects.filter(location__isnull=False)
    serializer_class = IssueSerializer


class IssueView(RetrieveAPIView):
    queryset = Issue.objects.all()
    serializer_class = FullIssueSerializer
    lookup_url_kwarg = 'issue_id'

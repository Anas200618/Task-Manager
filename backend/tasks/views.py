from rest_framework import generics, status as http_status
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer

VALID_STATUSES = {choice[0] for choice in Task.Status.choices}


class TaskListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/tasks/                -> list all tasks
    GET  /api/tasks/?status=pending -> list tasks filtered by status
    POST /api/tasks/                -> create a new task
    """

    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.all()
        status_param = self.request.query_params.get("status")
        if status_param is not None:
            queryset = queryset.filter(status=status_param)
        return queryset

    def list(self, request, *args, **kwargs):
        status_param = request.query_params.get("status")
        if status_param is not None and status_param not in VALID_STATUSES:
            return Response(
                {
                    "error": (
                        f"Invalid status '{status_param}'. "
                        f"Must be one of: {', '.join(sorted(VALID_STATUSES))}."
                    )
                },
                status=http_status.HTTP_400_BAD_REQUEST,
            )
        return super().list(request, *args, **kwargs)


class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/tasks/<id>/ -> retrieve a single task
    PATCH  /api/tasks/<id>/ -> partially update a task (e.g. status)
    PUT    /api/tasks/<id>/ -> fully update a task
    DELETE /api/tasks/<id>/ -> delete a task
    """

    queryset = Task.objects.all()
    serializer_class = TaskSerializer

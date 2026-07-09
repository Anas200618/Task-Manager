from django.core.management.base import BaseCommand

from tasks.models import Task


SAMPLE_TASKS = [
    {
        "title": "Set up project repository",
        "description": "Initialize the Django and React repositories with a base folder structure.",
        "status": Task.Status.DONE,
    },
    {
        "title": "Design Task model",
        "description": "Define the Task model with title, description, status, and created_at fields.",
        "status": Task.Status.DONE,
    },
    {
        "title": "Build Task list API",
        "description": "Implement GET /api/tasks/ with optional status filtering.",
        "status": Task.Status.IN_PROGRESS,
    },
    {
        "title": "Build Task create/update API",
        "description": "Implement POST /api/tasks/ and PATCH /api/tasks/<id>/.",
        "status": Task.Status.IN_PROGRESS,
    },
    {
        "title": "Build React task form",
        "description": "Create a form to add new tasks from the frontend.",
        "status": Task.Status.PENDING,
    },
    {
        "title": "Build React task list and filter",
        "description": "Display tasks, allow status updates, and filter by status.",
        "status": Task.Status.PENDING,
    },
    {
        "title": "Write README",
        "description": "",
        "status": Task.Status.PENDING,
    },
]


class Command(BaseCommand):
    help = "Seed the database with sample tasks for local development/demo purposes."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete all existing tasks before seeding.",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            deleted_count, _ = Task.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Deleted {deleted_count} existing task(s)."))

        created_count = 0
        for task_data in SAMPLE_TASKS:
            _, created = Task.objects.get_or_create(
                title=task_data["title"],
                defaults={
                    "description": task_data["description"],
                    "status": task_data["status"],
                },
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeding complete. Created {created_count} new task(s). "
                f"Total tasks in database: {Task.objects.count()}."
            )
        )

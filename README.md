# Task Manager

A simple full-stack Task Manager application.

- **Backend:** Django + Django REST Framework, SQLite database
- **Frontend:** React (single-page app), plain `fetch` calls, no styling framework

```
task-manager/
├── backend/    Django project ("taskmanager") + "tasks" app
└── frontend/   React app (create-react-app style)
```

---

## 1. Backend (Django) — setup and run

**Requirements:** Python 3.10+ and `pip`

```bash
cd backend

# 1. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Apply migrations (creates db.sqlite3)
python manage.py migrate

# 4. Seed the database with 5+ sample tasks (pending / in_progress / done)
python manage.py seed_tasks

# 5. Run the dev server
python manage.py runserver
```

The API is now available at `http://localhost:8000`.

### Seeding sample data

Two options are provided — either is enough on its own, `seed_tasks` is the
recommended one since it's idempotent (safe to re-run) and doesn't require
fixed primary keys:

- **Management command (recommended):** `python manage.py seed_tasks`
  (add `--clear` to wipe existing tasks first)
- **Fixture (alternative):** `python manage.py loaddata sample_tasks`

### API endpoints

| Method | Endpoint                     | Description                              |
|--------|-------------------------------|-------------------------------------------|
| GET    | `/api/tasks/`                 | List all tasks                            |
| GET    | `/api/tasks/?status=pending`  | List tasks filtered by status             |
| POST   | `/api/tasks/`                 | Create a task (`title`, `description`)    |
| GET    | `/api/tasks/<id>/`             | Retrieve a single task                    |
| PATCH  | `/api/tasks/<id>/`             | Update a task (e.g. `{"status": "done"}`) |
| DELETE | `/api/tasks/<id>/`             | Delete a task                             |

Valid `status` values: `pending`, `in_progress`, `done`.

- `GET /api/tasks/?status=invalid` → `400 Bad Request` with a JSON body like
  `{"error": "Invalid status 'invalid'. Must be one of: done, in_progress, pending."}`
- `POST /api/tasks/` with an empty/missing `title` → `400 Bad Request` with
  field-level validation errors, e.g. `{"title": ["Title must not be empty."]}`

An admin site is also available at `http://localhost:8000/admin/` if you
create a superuser with `python manage.py createsuperuser`.

---

## 2. Frontend (React) — setup and run

**Requirements:** Node.js 18+ and `npm`

```bash
cd frontend
npm install
npm start
```

The app runs at `http://localhost:3000` and talks to the API at
`http://localhost:8000` (hardcoded in `src/api.js`, as specified).

Make sure the Django server (step 1) is running first, otherwise the task
list and form will show connection errors.

---

## 3. Assumptions and decisions

- **Django REST Framework** was used (allowed, not mandatory) to get request
  parsing, serialization, and validation with less boilerplate than plain
  Django views.
- **Status filter validation** happens on `GET /api/tasks/`: an unrecognized
  `?status=` value returns `400` with a descriptive error message, as
  required. No `status` param at all returns all tasks.
- **Title validation**: the `title` field is required and cannot be blank or
  whitespace-only; this is enforced by the serializer and returns a `400`
  with a field-specific message.
- **Status validation on write** (`POST`/`PATCH`): DRF's `ChoiceField`
  (generated from the model's `choices`) automatically rejects any value
  that isn't `pending`, `in_progress`, or `done` with a `400` response.
- **CORS**: `django-cors-headers` is configured to allow only
  `http://localhost:3000` (the default CRA dev server origin), per the spec.
- **No authentication**: the API is fully open, as explicitly out of scope.
- **No pagination**: `GET /api/tasks/` returns a plain JSON array (pagination
  disabled in `REST_FRAMEWORK` settings) to keep the frontend simple.
- **Status updates**: changing the dropdown in the task list immediately
  fires a `PATCH /api/tasks/<id>/` and updates the UI optimistically once the
  API confirms the change (no separate "Save" button, per the spec).
- **Styling**: kept intentionally minimal/functional (a small shared
  `index.css`), no CSS framework, per the spec.
- **Database**: SQLite only, using Django's default file-based engine — no
  other database configuration is included.

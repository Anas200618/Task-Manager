# Task Manager

> **Version:** 1.0.0  
> **Project Type:** Full Stack Web Application  
> **Backend:** Django + Django REST Framework  
> **Frontend:** React  
> **Database:** SQLite  
> **Python:** 3.10+  
> **Node.js:** 18+  
> **License:** Educational / Assessment Project

---

## Overview

Task Manager is a simple full-stack web application that allows users to create, view, filter, and update tasks.

The backend is built using **Django** and **Django REST Framework**, exposing REST APIs consumed by a **React** single-page application. The project uses **SQLite** as its database and **django-cors-headers** to allow communication between the frontend and backend during development.

This project was developed as part of a Full Stack Developer assessment.

---

## Features

### Backend

- Create tasks
- Retrieve all tasks
- Filter tasks by status
- Update task status
- Delete tasks
- Input validation
- Sample data seeding
- RESTful API
- SQLite database
- CORS enabled for React frontend

### Frontend

- Create new tasks
- Display all tasks
- Filter tasks by status
- Update task status using dropdown
- Automatic refresh after task creation
- Error handling for invalid requests
- Simple and responsive user interface

---

## Project Structure

```text
task-manager/
├── backend/    Django project ("taskmanager") + "tasks" app
└── frontend/   React app (create-react-app style)
```

---

# Backend (Django)

## Requirements

- Python 3.10 or higher
- pip

---

## Setup & Run

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

# 5. Run the development server
python manage.py runserver
```

The backend server will be available at:

```
http://localhost:8000
```

---

## Sample Data

The project includes sample data so the application is immediately usable after setup.

Two methods are available:

### Recommended

```bash
python manage.py seed_tasks
```

This command is idempotent and can safely be executed multiple times.

To clear existing tasks before seeding:

```bash
python manage.py seed_tasks --clear
```

### Alternative

```bash
python manage.py loaddata sample_tasks
```

---

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | Retrieve all tasks |
| GET | `/api/tasks/?status=pending` | Retrieve pending tasks |
| POST | `/api/tasks/` | Create a new task |
| GET | `/api/tasks/<id>/` | Retrieve a single task |
| PATCH | `/api/tasks/<id>/` | Update task information |
| DELETE | `/api/tasks/<id>/` | Delete a task |

---

## Status Values

Supported task status values:

```
pending
in_progress
done
```

---

## Validation

### Title

- Required
- Cannot be empty
- Cannot contain only whitespace

Example response:

```json
{
    "title": [
        "Title must not be empty."
    ]
}
```

---

### Status Filter

Example:

```
GET /api/tasks/?status=invalid
```

Response:

```json
{
    "error": "Invalid status 'invalid'. Must be one of: done, in_progress, pending."
}
```

Returns:

```
400 Bad Request
```

---

## Django Admin

Create an administrator account:

```bash
python manage.py createsuperuser
```

Then access:

```
http://localhost:8000/admin/
```

---

# Frontend (React)

## Requirements

- Node.js 18 or higher
- npm

---

## Setup & Run

```bash
cd frontend

npm install

npm start
```

The frontend application runs at:

```
http://localhost:3000
```

The React application communicates with:

```
http://localhost:8000
```

The API base URL is hardcoded in:

```
src/api.js
```

> Ensure the Django backend server is running before starting the React application.

---

# Technologies Used

## Backend

- Python
- Django
- Django REST Framework
- SQLite
- django-cors-headers

## Frontend

- React
- JavaScript (ES6)
- HTML5
- CSS3
- Fetch API

---

# Assumptions & Design Decisions

- Django REST Framework is used to simplify API development, serialization, validation, and request handling.
- Task status is restricted to three valid values:
  - `pending`
  - `in_progress`
  - `done`
- Invalid status filters return **400 Bad Request** with a descriptive error message.
- Task titles are mandatory and cannot be blank or whitespace-only.
- Status validation is automatically handled through Django model choices and DRF serializer validation.
- CORS is configured using **django-cors-headers** to allow requests only from:

```
http://localhost:3000
```

- Authentication and authorization are intentionally omitted as they are outside the project scope.
- Pagination is disabled to keep the frontend implementation simple.
- Status updates are applied immediately when the dropdown value changes by sending a `PATCH` request.
- The UI is intentionally minimal with no CSS framework to focus on functionality.
- SQLite is used as the project's only database.

---

# Running the Project

## Start Backend

```bash
cd backend

python manage.py runserver
```

---

## Start Frontend

```bash
cd frontend

npm start
```

---

# Default URLs

| Service | URL |
|----------|-----|
| Django Backend | http://localhost:8000 |
| React Frontend | http://localhost:3000 |
| Django Admin | http://localhost:8000/admin/ |
| Task API | http://localhost:8000/api/tasks/ |

---

# Project Notes

- This project follows a simple REST architecture.
- No authentication or user management is implemented.
- SQLite is used for simplicity and portability.
- Sample tasks are included through a management command and fixture.
- The project is intended for local development and assessment purposes.

---

## Author

**Task Manager**

Version **1.0.0**

Developed as a Full Stack Developer assessment using **Django**, **Django REST Framework**, **React**, and **SQLite**.

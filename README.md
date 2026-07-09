# Task Manager

> **Version:** 1.0.0
> **Role:** Full Stack Developer Assessment
> **Backend:** Django + Django REST Framework
> **Frontend:** React
> **Database:** SQLite
> **Python:** 3.10+
> **Node.js:** 18+

---

# Overview

Task Manager is a simple full-stack web application built using **Django**, **Django REST Framework**, and **React**.

The application allows users to:

* Create new tasks
* View all tasks
* Filter tasks by status
* Update the status of existing tasks

The backend exposes a REST API that is consumed by a React single-page application.

---

# Features

## Backend

* Django REST API
* SQLite database
* Create tasks
* View all tasks
* Filter tasks by status
* Update task status
* Delete tasks
* Task validation
* Status validation
* Sample task seeding
* CORS support for React

## Frontend

* Single-page React application
* Create Task form
* Display all tasks
* Filter tasks by status
* Update task status using dropdown
* Automatic refresh after task creation
* API validation error handling

---

# Project Structure

```text
task-manager/
├── backend/    Django project ("taskmanager") + "tasks" app
└── frontend/   React app (create-react-app style)
```

---

# Technologies Used

## Backend

* Python
* Django
* Django REST Framework
* SQLite
* django-cors-headers

## Frontend

* React
* JavaScript (ES6)
* HTML5
* CSS3
* Fetch API

---

# Installation & Setup

## 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager
```

---

## 2. Backend Setup

### Requirements

* Python 3.10+
* pip

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Insert sample tasks
python manage.py seed_tasks

# Start Django server
python manage.py runserver
```

Backend URL

```
http://localhost:8000
```

---

## 3. Frontend Setup

### Requirements

* Node.js 18+
* npm

Open a new terminal.

```bash
cd frontend

# Install dependencies
npm install

# Start React application
npm start
```

Frontend URL

```
http://localhost:3000
```

React communicates with

```
http://localhost:8000
```

---

# Sample Data

The project includes a management command that inserts at least **five sample tasks** with different statuses.

```bash
python manage.py seed_tasks
```

To clear existing tasks before inserting new ones:

```bash
python manage.py seed_tasks --clear
```

Alternatively:

```bash
python manage.py loaddata sample_tasks
```

---

# API Endpoints

| Method | Endpoint                         | Description                |
| ------ | -------------------------------- | -------------------------- |
| GET    | `/api/tasks/`                    | Retrieve all tasks         |
| GET    | `/api/tasks/?status=pending`     | Retrieve pending tasks     |
| GET    | `/api/tasks/?status=in_progress` | Retrieve in-progress tasks |
| GET    | `/api/tasks/?status=done`        | Retrieve completed tasks   |
| POST   | `/api/tasks/`                    | Create a task              |
| GET    | `/api/tasks/<id>/`               | Retrieve a task            |
| PATCH  | `/api/tasks/<id>/`               | Update task status         |
| DELETE | `/api/tasks/<id>/`               | Delete a task              |

---

# Task Model

| Field       | Type          | Description                      |
| ----------- | ------------- | -------------------------------- |
| title       | CharField     | Required, maximum 255 characters |
| description | TextField     | Optional                         |
| status      | CharField     | pending, in_progress, done       |
| created_at  | DateTimeField | Automatically set on creation    |

Default Status

```
pending
```

---

# Validation Rules

## Title

* Required
* Cannot be empty
* Cannot contain only whitespace

Example Response

```json
{
    "title": [
        "Title must not be empty."
    ]
}
```

---

## Status

Allowed values

```
pending
in_progress
done
```

Example

```
GET /api/tasks/?status=invalid
```

Response

```json
{
    "error": "Invalid status 'invalid'. Must be one of: done, in_progress, pending."
}
```

Returns

```
400 Bad Request
```

---

# Frontend Functionality

## Create Task

The task creation form provides:

* Required title field
* Optional description field
* POST request to `/api/tasks/`
* Automatic task list refresh after successful creation
* Validation error messages for invalid requests

---

## Task List

On page load the application:

* Retrieves all tasks
* Displays title
* Displays description
* Displays current status

Each task contains a status dropdown.

Changing the dropdown immediately sends:

```
PATCH /api/tasks/<id>/
```

The updated status is reflected immediately in the user interface.

---

## Status Filter

Available filter options:

* All
* Pending
* In Progress
* Done

Selecting a filter sends:

```
GET /api/tasks/
```

or

```
GET /api/tasks/?status=<value>
```

depending on the selected option.

---

# Assumptions & Decisions

* **Django REST Framework (DRF)** is used (allowed but not mandatory) to simplify REST API development by providing request parsing, serialization, validation, and response handling with less boilerplate than plain Django views.

* **SQLite** is used as the project's database, following the assessment requirements. No additional database configuration is required.

* A **management command (`seed_tasks`)** is provided to populate the database with at least five sample tasks having different statuses (`pending`, `in_progress`, and `done`) so the application contains data immediately after setup.

* The **Task model** contains the following fields:

  * `title` (Required, maximum 255 characters)
  * `description` (Optional)
  * `status`
  * `created_at`

* **Title validation** is handled by the DRF serializer. The `title` field is required and cannot be empty or contain only whitespace. Invalid requests return a **400 Bad Request** response with field-specific validation messages.

* The **status** field supports only the following predefined values:

  * `pending`
  * `in_progress`
  * `done`

* **Status validation on create and update** (`POST` and `PATCH`) is automatically handled by DRF's `ChoiceField`, which rejects any value outside the allowed choices with a **400 Bad Request** response.

* **Status filter validation** is implemented on `GET /api/tasks/`. When the optional `status` query parameter is provided, only valid values (`pending`, `in_progress`, or `done`) are accepted. Invalid values return a descriptive **400 Bad Request** response, while omitting the parameter returns all tasks.

* The API follows standard **RESTful principles**, using:

  * `GET` for retrieving tasks
  * `POST` for creating tasks
  * `PATCH` for updating task status
  * `DELETE` for removing tasks

* Task status updates are performed immediately using **PATCH** requests. Changing the status dropdown sends a request to `PATCH /api/tasks/<id>/`, and the frontend updates the UI immediately after a successful response without requiring an additional **Save** button.

* The React frontend automatically refreshes the task list after successfully creating a new task to ensure the displayed data remains synchronized with the backend.

* **CORS** is configured using **django-cors-headers** to allow requests only from the React development server:

  ```
  http://localhost:3000
  ```

* The React application communicates with the backend using the hardcoded API base URL specified in the project requirements:

  ```
  http://localhost:8000
  ```

* **No authentication or authorization** is implemented because user management is explicitly listed as out of scope for this assessment.

* **No pagination** is implemented. `GET /api/tasks/` returns a plain JSON array to keep both the API and frontend simple and aligned with the project requirements.

* The user interface is intentionally **minimal, clean, and functional**. No CSS framework or advanced styling library is used, allowing the project to focus on functionality rather than design.

* The project is intended for **local development** only and is not configured for production deployment, hosting, or containerization.

* The project follows a simple separation of concerns by organizing the backend and frontend into independent directories, making the codebase easier to maintain and extend.
  
---

# Default URLs

| Service           | URL                              |
| ----------------- | -------------------------------- |
| Backend API       | http://localhost:8000            |
| React Application | http://localhost:3000            |
| Task API          | http://localhost:8000/api/tasks/ |

---

# Out of Scope

The following features are intentionally **not implemented**:

* User login or authentication
* Databases other than SQLite
* Deployment or hosting
* CSS frameworks or advanced UI styling

---

# Author

**Name:** Mansuri Mohammad Anas Mohammad Idris

**Branch:** Artificial Intelligence & Machine Learning (AIML)

**Project:** Task Manager

**Version:** 1.0.0

**Technology Stack:**

* Python
* Django
* Django REST Framework
* React
* SQLite

This project was developed as part of a **Full Stack Developer Assessment**, demonstrating the implementation of a Django REST API and a React frontend for task creation, task management, status filtering, and status updates.

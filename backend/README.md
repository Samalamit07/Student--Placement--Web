# Backend — Student Management & Placement System

FastAPI backend using FastAPI and SQLAlchemy 2.x. The default development database is SQLite; SQL Server remains supported through `DATABASE_URL`.

## Prerequisites

- Python 3.12+
- No database server is required for local development.
- Microsoft SQL Server and ODBC Driver 18 are only required when using a SQL Server `DATABASE_URL`.

## Setup

```bash
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

pip install -r requirements.txt
# Windows PowerShell: copy .env.example .env, then edit DATABASE_URL and SECRET_KEY
```

## Database

The checked-in development configuration uses `sqlite:///./student_placement.db`. The tables are created automatically when the API starts.

To use SQL Server instead, set `DATABASE_URL` in `backend/.env` to a valid SQLAlchemy `mssql+pyodbc` URL, create the database in SSMS or `sqlcmd`, and ensure TCP/IP and Windows authentication are configured.

For SQL Server, create an empty database first:

```sql
CREATE DATABASE StudentPlacementDB;
```

Tables are created automatically on first run via SQLAlchemy `Base.metadata.create_all`.

## Run

```bash
# Run from the backend directory
uvicorn app.main:app --reload

# Or run from the repository root
python -m uvicorn app.main:app --app-dir backend --reload
```

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## Seed sample data

```bash
python seed.py
```

Creates 1 admin, 10 students, 5 companies, 10 jobs, sample skills and applications.
Default dev admin login: `admin@placement.dev` / `Admin@123` (development only — never use in production).

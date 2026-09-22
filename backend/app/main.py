import logging

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.database.database import Base, engine
from app.models import *  # noqa: F401,F403 — ensures all models are registered before create_all

from app.routes import auth, students, skills, companies, jobs, applications, dashboard

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Student Management & Placement System API",
    description="Backend REST API powering the web and mobile placement system apps.",
    version="1.0.0",
)


@app.on_event("startup")
def initialize_database():
    """Create missing tables without preventing the API from starting."""
    try:
        Base.metadata.create_all(bind=engine)
    except SQLAlchemyError:
        logger.exception(
            "Database initialization failed. Check DATABASE_URL and SQL Server availability."
        )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN, "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(students.router)
app.include_router(skills.router)
app.include_router(companies.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"message": "Student Placement System API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

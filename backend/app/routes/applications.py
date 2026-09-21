from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user, require_admin, require_student
from app.models.application import Application
from app.models.job import Job
from app.models.student import Student
from app.models.user import User, RoleEnum
from app.schemas.application import (
    ApplicationCreate,
    ApplicationStatusUpdate,
    ApplicationOut,
    ApplicationListOut,
)
from app.services.application_service import ensure_not_duplicate
from app.services.student_service import check_eligibility

router = APIRouter(prefix="/api/applications", tags=["Applications"])


def _to_out(app: Application) -> dict:
    return {
        "id": app.id,
        "student_id": app.student_id,
        "student_name": app.student.user.name,
        "job_id": app.job_id,
        "job_title": app.job.title,
        "company_name": app.job.company.name,
        "status": app.status,
        "applied_at": app.applied_at,
    }


@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student),
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")

    job = db.query(Job).filter(Job.id == payload.job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    ensure_not_duplicate(db, student.id, job.id)

    eligible, reason = check_eligibility(db, student, job)
    if not eligible:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Not eligible: {reason}")

    application = Application(student_id=student.id, job_id=job.id)
    db.add(application)
    db.commit()
    db.refresh(application)
    return _to_out(application)


@router.get("", response_model=ApplicationListOut)
def list_applications(
    status_filter: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Application)

    if current_user.role == RoleEnum.student:
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        query = query.filter(Application.student_id == student.id)

    if status_filter:
        query = query.filter(Application.status == status_filter)

    applications = query.order_by(Application.applied_at.desc()).all()
    return ApplicationListOut(items=[_to_out(a) for a in applications], total=len(applications))


@router.get("/{application_id}", response_model=ApplicationOut)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    if current_user.role == RoleEnum.student and application.student.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this application")

    return _to_out(application)


@router.put("/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    application.status = payload.status
    db.commit()
    db.refresh(application)
    return _to_out(application)

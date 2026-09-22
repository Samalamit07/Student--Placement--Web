from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user, require_admin, require_student
from app.models.job import Job
from app.models.company import Company
from app.models.student import Student
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate, JobOut, JobListOut, EligibilityOut
from app.services.job_service import build_job_query
from app.services.student_service import check_eligibility

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


def _to_out(job: Job) -> dict:
    return {
        "id": job.id,
        "company_id": job.company_id,
        "company_name": job.company.name,
        "title": job.title,
        "description": job.description,
        "location": job.location,
        "salary": job.salary,
        "minimum_cgpa": job.minimum_cgpa,
        "graduation_year": job.graduation_year,
        "department": job.department,
        "deadline": job.deadline,
        "created_at": job.created_at,
    }


@router.get("", response_model=JobListOut)
def list_jobs(
    search: str | None = None,
    department: str | None = None,
    location: str | None = None,
    min_cgpa: float | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = build_job_query(db, search, department, min_cgpa, location)
    jobs = query.order_by(Job.deadline).all()
    return JobListOut(items=[_to_out(j) for j in jobs], total=len(jobs))


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return _to_out(job)


@router.get("/{job_id}/eligibility", response_model=EligibilityOut)
def get_eligibility(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_student)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")

    eligible, reason = check_eligibility(db, student, job)
    return EligibilityOut(eligible=eligible, reason=reason)


@router.post("", response_model=JobOut, status_code=status.HTTP_201_CREATED)
def create_job(payload: JobCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    company = db.query(Company).filter(Company.id == payload.company_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

    job = Job(**payload.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return _to_out(job)


@router.put("/{job_id}", response_model=JobOut)
def update_job(
    job_id: int,
    payload: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)
    return _to_out(job)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    db.delete(job)
    db.commit()

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import require_admin, require_student
from app.models.student import Student
from app.models.company import Company
from app.models.job import Job
from app.models.application import Application, StatusEnum
from app.models.user import User
from app.schemas.dashboard import AdminDashboardOut, StudentDashboardOut

router = APIRouter(prefix="/api", tags=["Dashboard"])


@router.get("/admin/dashboard", response_model=AdminDashboardOut)
def admin_dashboard(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    total_students = db.query(Student).count()
    total_companies = db.query(Company).count()
    total_jobs = db.query(Job).count()
    total_applications = db.query(Application).count()
    selected = db.query(Application).filter(Application.status == StatusEnum.selected).count()
    rejected = db.query(Application).filter(Application.status == StatusEnum.rejected).count()
    pending = total_applications - selected - rejected

    return AdminDashboardOut(
        total_students=total_students,
        total_companies=total_companies,
        total_jobs=total_jobs,
        total_applications=total_applications,
        selected=selected,
        pending=pending,
        rejected=rejected,
    )


@router.get("/student/dashboard", response_model=StudentDashboardOut)
def student_dashboard(db: Session = Depends(get_db), current_user: User = Depends(require_student)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")

    now = datetime.now(timezone.utc)
    available_jobs = (
        db.query(Job)
        .filter(Job.deadline >= now)
        .filter(Job.minimum_cgpa <= student.cgpa)
        .filter(Job.graduation_year == student.graduation_year)
        .count()
    )

    applications = db.query(Application).filter(Application.student_id == student.id).all()
    selected = sum(1 for a in applications if a.status == StatusEnum.selected)
    rejected = sum(1 for a in applications if a.status == StatusEnum.rejected)
    pending = len(applications) - selected - rejected

    filled_fields = [student.phone, student.department, student.course, student.cgpa, student.resume]
    profile_completion = int(sum(1 for f in filled_fields if f) / len(filled_fields) * 100)

    return StudentDashboardOut(
        name=student.user.name,
        course=student.course,
        department=student.department,
        cgpa=student.cgpa,
        profile_completion=profile_completion,
        skills=[s.skill_name for s in student.skills],
        available_jobs=available_jobs,
        total_applications=len(applications),
        selected=selected,
        pending=pending,
        rejected=rejected,
    )

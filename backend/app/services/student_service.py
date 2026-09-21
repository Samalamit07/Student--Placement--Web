from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.student import Student
from app.models.job import Job


def check_eligibility(db: Session, student: Student, job: Job) -> tuple[bool, str | None]:
    if student.cgpa < job.minimum_cgpa:
        return False, f"Minimum CGPA required is {job.minimum_cgpa}, your CGPA is {student.cgpa}"

    if job.department.lower() != "any" and job.department.lower() != student.department.lower():
        return False, f"This job is open to {job.department} students only"

    if job.graduation_year != student.graduation_year:
        return False, f"This job is open to the {job.graduation_year} graduating batch only"

    if job.deadline.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        return False, "The application deadline has passed"

    return True, None


def ensure_student_owns_or_admin(current_user, student: Student):
    from app.models.user import RoleEnum

    if current_user.role == RoleEnum.admin:
        return
    if student.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this student record")

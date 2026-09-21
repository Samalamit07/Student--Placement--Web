import math

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.database import get_db
from app.dependencies.auth import get_current_user, require_admin, require_student
from app.models.student import Student
from app.models.user import User, RoleEnum
from app.schemas.student import StudentCreate, StudentUpdate, StudentOut, StudentListOut
from app.services.student_service import ensure_student_owns_or_admin
from app.services.auth_service import register_user
from app.schemas.user import UserRegister
from app.models.user import RoleEnum as _RoleEnum

router = APIRouter(prefix="/api/students", tags=["Students"])


def _to_out(student: Student) -> dict:
    return {
        "id": student.id,
        "user_id": student.user_id,
        "name": student.user.name,
        "email": student.user.email,
        "roll_number": student.roll_number,
        "phone": student.phone,
        "department": student.department,
        "course": student.course,
        "cgpa": student.cgpa,
        "graduation_year": student.graduation_year,
        "resume": student.resume,
        "skills": student.skills,
        "created_at": student.created_at,
    }


@router.get("", response_model=StudentListOut)
def list_students(
    search: str | None = None,
    department: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Admin only. List/search students with pagination."""
    query = db.query(Student)
    if search:
        like = f"%{search}%"
        query = query.join(User).filter(
            or_(User.name.ilike(like), Student.roll_number.ilike(like), Student.department.ilike(like))
        )
    if department:
        query = query.filter(Student.department.ilike(f"%{department}%"))

    total = query.count()
    students = query.offset((page - 1) * page_size).limit(page_size).all()

    return StudentListOut(
        items=[_to_out(s) for s in students],
        total=total,
        page=page,
        total_pages=max(1, math.ceil(total / page_size)),
    )


@router.post("", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(
    payload: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Admin only. Creates a user + student profile in one step."""
    register_payload = UserRegister(
        name=payload.name,
        email=payload.email,
        password=payload.password,
        role=_RoleEnum.student,
        roll_number=payload.roll_number,
        phone=payload.phone,
        department=payload.department,
        course=payload.course,
        cgpa=payload.cgpa,
        graduation_year=payload.graduation_year,
    )
    user = register_user(db, register_payload)
    return _to_out(user.student)


@router.get("/me", response_model=StudentOut)
def get_my_student_profile(current_user: User = Depends(require_student), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    return _to_out(student)


@router.get("/{student_id:int}", response_model=StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    ensure_student_owns_or_admin(current_user, student)
    return _to_out(student)


@router.put("/{student_id:int}", response_model=StudentOut)
def update_student(
    student_id: int,
    payload: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    ensure_student_owns_or_admin(current_user, student)

    data = payload.model_dump(exclude_unset=True)
    if "name" in data:
        student.user.name = data.pop("name")
    for field, value in data.items():
        setattr(student, field, value)

    db.commit()
    db.refresh(student)
    return _to_out(student)


@router.delete("/{student_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    """Admin only."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    user = student.user
    db.delete(student)
    db.delete(user)
    db.commit()

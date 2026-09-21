from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User, RoleEnum
from app.models.student import Student
from app.schemas.user import UserRegister


def register_user(db: Session, payload: UserRegister) -> User:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    if payload.role == RoleEnum.student:
        required = [payload.roll_number, payload.department, payload.course, payload.cgpa, payload.graduation_year]
        if any(v is None for v in required):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="roll_number, department, course, cgpa and graduation_year are required for student registration",
            )
        existing_roll = db.query(Student).filter(Student.roll_number == payload.roll_number).first()
        if existing_roll:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Roll number already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.flush()  # get user.id before commit

    if payload.role == RoleEnum.student:
        student = Student(
            user_id=user.id,
            roll_number=payload.roll_number,
            phone=payload.phone,
            department=payload.department,
            course=payload.course,
            cgpa=payload.cgpa,
            graduation_year=payload.graduation_year,
        )
        db.add(student)

    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return user


def build_token_for_user(user: User) -> str:
    return create_access_token(data={"sub": str(user.id), "role": user.role.value})

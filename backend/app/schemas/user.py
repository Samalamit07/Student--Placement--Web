from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict

from app.models.user import RoleEnum


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: RoleEnum = RoleEnum.student
    # Student-only fields, required when role == student
    roll_number: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    course: Optional[str] = None
    cgpa: Optional[float] = None
    graduation_year: Optional[int] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    role: RoleEnum
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

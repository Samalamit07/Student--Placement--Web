from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, ConfigDict, field_validator

from app.schemas.skill import SkillOut


class StudentBase(BaseModel):
    roll_number: str
    phone: Optional[str] = None
    department: str
    course: str
    cgpa: float
    graduation_year: int
    resume: Optional[str] = None

    @field_validator("cgpa")
    @classmethod
    def cgpa_range(cls, v):
        if not 0 <= v <= 10:
            raise ValueError("cgpa must be between 0 and 10")
        return v


class StudentCreate(StudentBase):
    name: str
    email: EmailStr
    password: str


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    course: Optional[str] = None
    cgpa: Optional[float] = None
    graduation_year: Optional[int] = None
    resume: Optional[str] = None


class StudentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    name: str
    email: EmailStr
    roll_number: str
    phone: Optional[str] = None
    department: str
    course: str
    cgpa: float
    graduation_year: int
    resume: Optional[str] = None
    skills: List[SkillOut] = []
    created_at: datetime


class StudentListOut(BaseModel):
    items: List[StudentOut]
    total: int
    page: int
    total_pages: int

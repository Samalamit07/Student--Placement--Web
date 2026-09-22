from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict


class JobBase(BaseModel):
    company_id: int
    title: str
    description: Optional[str] = None
    location: str
    salary: Optional[str] = None
    minimum_cgpa: float = 0
    graduation_year: int
    department: str
    deadline: datetime


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    minimum_cgpa: Optional[float] = None
    graduation_year: Optional[int] = None
    department: Optional[str] = None
    deadline: Optional[datetime] = None


class JobOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    company_name: str
    title: str
    description: Optional[str] = None
    location: str
    salary: Optional[str] = None
    minimum_cgpa: float
    graduation_year: int
    department: str
    deadline: datetime
    created_at: datetime


class JobListOut(BaseModel):
    items: List[JobOut]
    total: int


class EligibilityOut(BaseModel):
    eligible: bool
    reason: Optional[str] = None

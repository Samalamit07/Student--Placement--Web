from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict

from app.models.application import StatusEnum


class ApplicationCreate(BaseModel):
    job_id: int


class ApplicationStatusUpdate(BaseModel):
    status: StatusEnum


class ApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    student_name: str
    job_id: int
    job_title: str
    company_name: str
    status: StatusEnum
    applied_at: datetime


class ApplicationListOut(BaseModel):
    items: List[ApplicationOut]
    total: int

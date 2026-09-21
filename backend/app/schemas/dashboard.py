from typing import List

from pydantic import BaseModel


class AdminDashboardOut(BaseModel):
    total_students: int
    total_companies: int
    total_jobs: int
    total_applications: int
    selected: int
    pending: int
    rejected: int


class StudentDashboardOut(BaseModel):
    name: str
    course: str
    department: str
    cgpa: float
    profile_completion: int
    skills: List[str]
    available_jobs: int
    total_applications: int
    selected: int
    pending: int
    rejected: int

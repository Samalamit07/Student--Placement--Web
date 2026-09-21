from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.job import Job
from app.models.company import Company


def build_job_query(db: Session, search: str | None, department: str | None, min_cgpa: float | None, location: str | None):
    query = db.query(Job).join(Company)

    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(
                Job.title.ilike(like),
                Company.name.ilike(like),
                Job.location.ilike(like),
                Job.department.ilike(like),
                Job.location.ilike("%All India%"),
            )
        )
    if department:
        query = query.filter(Job.department.ilike(f"%{department}%"))
    if min_cgpa is not None:
        query = query.filter(Job.minimum_cgpa <= min_cgpa)
    if location:
        query = query.filter(
            or_(Job.location.ilike(f"%{location}%"), Job.location.ilike("%All India%"))
        )

    return query

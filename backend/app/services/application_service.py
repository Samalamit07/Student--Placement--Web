from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.application import Application


def ensure_not_duplicate(db: Session, student_id: int, job_id: int):
    existing = (
        db.query(Application)
        .filter(Application.student_id == student_id, Application.job_id == job_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already applied to this job")

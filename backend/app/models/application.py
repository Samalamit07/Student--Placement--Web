import enum
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, DateTime, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database.database import Base


class StatusEnum(str, enum.Enum):
    applied = "Applied"
    under_review = "Under Review"
    shortlisted = "Shortlisted"
    selected = "Selected"
    rejected = "Rejected"


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint("student_id", "job_id", name="uq_student_job_application"),
    )

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    status = Column(Enum(StatusEnum), nullable=False, default=StatusEnum.applied)
    applied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    student = relationship("Student", back_populates="applications")
    job = relationship("Job", back_populates="applications")

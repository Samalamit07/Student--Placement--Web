from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user
from app.models.skill import Skill
from app.models.student import Student
from app.schemas.skill import SkillCreate, SkillOut
from app.services.student_service import ensure_student_owns_or_admin

router = APIRouter(prefix="/api", tags=["Skills"])


@router.get("/students/{student_id}/skills", response_model=list[SkillOut])
def list_skills(student_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student.skills


@router.post("/students/{student_id}/skills", response_model=SkillOut, status_code=status.HTTP_201_CREATED)
def add_skill(
    student_id: int,
    payload: SkillCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    ensure_student_owns_or_admin(current_user, student)

    skill = Skill(student_id=student_id, skill_name=payload.skill_name)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(skill_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    ensure_student_owns_or_admin(current_user, skill.student)

    db.delete(skill)
    db.commit()

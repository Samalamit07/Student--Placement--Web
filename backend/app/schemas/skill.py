from pydantic import BaseModel, ConfigDict


class SkillCreate(BaseModel):
    skill_name: str


class SkillOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    skill_name: str

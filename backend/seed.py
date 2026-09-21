"""
Seed script for development only.
Creates 1 admin, 10 students, 5 companies, 10 jobs, sample skills and a few applications.

Run with:  python seed.py
"""

import random
from datetime import datetime, timedelta, timezone

from app.database.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User, RoleEnum
from app.models.student import Student
from app.models.skill import Skill
from app.models.company import Company
from app.models.job import Job
from app.models.application import Application, StatusEnum

Base.metadata.create_all(bind=engine)

DEPARTMENTS = ["Computer Science", "Information Technology", "Electronics", "Mechanical"]
SKILLS_POOL = ["Python", "JavaScript", "React", "SQL", "Java", "C++", "Machine Learning", "Communication"]


def run():
    db = SessionLocal()
    try:
        if db.query(User).filter(User.email == "admin@placement.dev").first():
            print("Seed data already exists. Skipping.")
            return

        # --- Admin ---
        admin = User(
            name="Placement Admin",
            email="admin@placement.dev",
            password_hash=hash_password("Admin@123"),
            role=RoleEnum.admin,
        )
        db.add(admin)
        db.flush()

        # --- Students ---
        students = []
        for i in range(1, 11):
            user = User(
                name=f"Student {i}",
                email=f"student{i}@placement.dev",
                password_hash=hash_password("Student@123"),
                role=RoleEnum.student,
            )
            db.add(user)
            db.flush()

            student = Student(
                user_id=user.id,
                roll_number=f"CS{1000 + i}",
                phone=f"90000000{i:02d}",
                department=random.choice(DEPARTMENTS),
                course="B.Tech",
                cgpa=round(random.uniform(6.5, 9.5), 2),
                graduation_year=2026,
            )
            db.add(student)
            db.flush()

            for skill_name in random.sample(SKILLS_POOL, 3):
                db.add(Skill(student_id=student.id, skill_name=skill_name))

            students.append(student)

        # --- Companies ---
        company_names = ["TechNova", "CodeCraft", "DataSphere", "CloudWorks", "NextGen Systems"]
        companies = []
        for i, name in enumerate(company_names, start=1):
            company = Company(
                name=name,
                description=f"{name} is a growing technology company.",
                website=f"https://{name.lower().replace(' ', '')}.example.com",
                location=random.choice(["Bangalore", "Hyderabad", "Pune", "Bhubaneswar"]),
            )
            db.add(company)
            db.flush()
            companies.append(company)

        # --- Jobs ---
        jobs = []
        for i in range(1, 11):
            company = random.choice(companies)
            job = Job(
                company_id=company.id,
                title=random.choice(["Software Engineer Intern", "Frontend Developer", "Backend Developer", "Data Analyst"]),
                description="Exciting opportunity to work on real-world projects.",
                location="All India",
                salary=f"{random.randint(4, 12)} LPA",
                minimum_cgpa=round(random.uniform(6.0, 8.0), 1),
                graduation_year=2026,
                department=random.choice(DEPARTMENTS + ["Any"]),
                deadline=datetime.now(timezone.utc) + timedelta(days=random.randint(10, 60)),
            )
            db.add(job)
            db.flush()
            jobs.append(job)

        # --- Sample Applications ---
        statuses = list(StatusEnum)
        for student in students[:6]:
            for job in random.sample(jobs, 2):
                application = Application(
                    student_id=student.id,
                    job_id=job.id,
                    status=random.choice(statuses),
                )
                db.add(application)

        db.commit()
        print("Seed data created successfully.")
        print("Admin login -> email: admin@placement.dev | password: Admin@123 (development only)")
        print("Student login -> email: student1@placement.dev | password: Student@123 (development only)")

    finally:
        db.close()


if __name__ == "__main__":
    run()

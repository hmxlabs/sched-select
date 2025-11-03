from sqlalchemy.orm import Session, joinedload
from . import models, schemas

# ---- Schedulers ----
def get_schedulers(db: Session):
    return db.query(models.Scheduler).all()

def create_scheduler(db: Session, scheduler: schemas.SchedulerBase):
    db_scheduler = models.Scheduler(**scheduler.dict())
    db.add(db_scheduler)
    db.commit()
    db.refresh(db_scheduler)
    return db_scheduler


# ---- Answer Types ----
def get_answer_types(db: Session):
    return db.query(models.AnswerType).all()

def create_answer_type(db: Session, answer: schemas.AnswerTypeBase):
    db_answer = models.AnswerType(**answer.dict())
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer


# ---- Questions ----
def get_questions(db: Session):
    return db.query(models.Question).options(
        joinedload(models.Question.answer_type)
    ).all()

def create_question(db: Session, question: schemas.QuestionBase, answer_type_id: int):
    db_question = models.Question(**question.dict(), answer_type_id=answer_type_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

# ---- User Answers ----
def create_user_answer(db: Session, answer: schemas.UserAnswerCreate):
    db_answer = models.UserAnswer(**answer.dict())
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

def get_all_answers(db: Session):
    return db.query(models.UserAnswer).order_by(models.UserAnswer.created_at.desc()).all()
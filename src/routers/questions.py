from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, db, schemas

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.get("/", response_model=list[schemas.QuestionResponse])
def get_questions(db: Session = Depends(db.get_db)):
    return crud.get_questions(db)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, db, schemas

router = APIRouter(prefix="/answers", tags=["Answers"])

@router.get("/", response_model=list[schemas.AnswerTypeResponse])
def get_answer_types(db: Session = Depends(db.get_db)):
    return crud.get_answer_types(db)

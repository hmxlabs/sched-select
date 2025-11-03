from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, db, schemas

router = APIRouter(prefix="/schedulers", tags=["Schedulers"])

@router.get("/", response_model=list[schemas.SchedulerResponse])
def get_schedulers(db: Session = Depends(db.get_db)):
    return crud.get_schedulers(db)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, db, schemas
import uuid

router = APIRouter(prefix="/user-answers", tags=["User Answers"])

@router.post("/", response_model=schemas.UserAnswerResponse, status_code=201)
def save_user_answers(
    answer: schemas.UserAnswerCreate, 
    db: Session = Depends(db.get_db)
):
    """
    Save user answers to the database.
    user_id is optional - if not provided, will be None.
    This allows saving answers for statistics without requiring authentication.
    """
    # Create the user answer (user_id can be None)
    saved_answer = crud.create_user_answer(db, answer)
    return saved_answer

@router.get("/", response_model=list[schemas.UserAnswerResponse])
def list_user_answers(db: Session = Depends(db.get_db)):
    """
    Get all user answers (for statistics/admin purposes).
    Returns all saved answers ordered by creation date.
    """
    return crud.get_all_answers(db)

@router.get("/stats")
def get_answer_stats(db: Session = Depends(db.get_db)):
    """
    Get statistics about user answers.
    Returns count of total submissions and breakdown by questions.
    """
    all_answers = crud.get_all_answers(db)
    total_submissions = len(all_answers)
    
    # Count answers per question key
    question_counts = {}
    for submission in all_answers:
        if submission.answers:
            for key, value in submission.answers.items():
                if key not in question_counts:
                    question_counts[key] = {}
                
                # Convert lists to strings for hashing (for multi-select answers)
                if isinstance(value, list):
                    value_str = str(sorted(value))  # Sort for consistency
                else:
                    value_str = str(value)
                
                if value_str not in question_counts[key]:
                    question_counts[key][value_str] = 0
                question_counts[key][value_str] += 1
    
    return {
        "total_submissions": total_submissions,
        "question_breakdown": question_counts
    }

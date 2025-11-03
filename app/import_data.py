import json
import os
from pathlib import Path
from sqlalchemy.orm import Session
from . import models
from .db import SessionLocal

def import_data():
    """Import data from JSON files into the database"""
    db: Session = SessionLocal()
    
    try:
        # Get the path to the data directory
        current_dir = Path(__file__).parent
        data_dir = current_dir / "data"
        
        # Check if data already exists to avoid duplicates
        existing_answers = db.query(models.AnswerType).count()
        existing_questions = db.query(models.Question).count()
        existing_schedulers = db.query(models.Scheduler).count()
        
        print(f"📊 Current database state: {existing_answers} answer types, {existing_questions} questions, {existing_schedulers} schedulers")
        
        # Load Answer Types (only if none exist)
        if existing_answers == 0:
            answers_file = data_dir / "answers.json"
            print(f"📂 Loading answer types from {answers_file}")
            with open(answers_file) as f:
                answers = json.load(f)
            for key, value in answers.items():
                answer = models.AnswerType(key=key, type=value["type"], options=value["options"])
                db.add(answer)
            
            db.commit()
            print(f"✅ Imported {len(answers)} answer types")
        else:
            print(f"⏭️  Skipping answer types import (already exist: {existing_answers})")
        
        # Load Questions (only if none exist)
        if existing_questions == 0:
            questions_file = data_dir / "questions.json"
            print(f"📂 Loading questions from {questions_file}")
            with open(questions_file) as f:
                questions = json.load(f)
            
            for q in questions:
                # Find the answer type by key (question key matches answer type key)
                answer_type = db.query(models.AnswerType).filter_by(key=q["key"]).first()
                question = models.Question(
                    id=q["id"],
                    question=q["question"],
                    hint=q.get("hint"),
                    key=q["key"],
                    type=q["type"],
                    answer_type_id=answer_type.id if answer_type else None,
                )
                db.add(question)
            
            db.commit()
            print(f"✅ Imported {len(questions)} questions")
        else:
            print(f"⏭️  Skipping questions import (already exist: {existing_questions})")
        
        # Load Schedulers (only if none exist)
        if existing_schedulers == 0:
            schedulers_file = data_dir / "schedulers.json"
            print(f"📂 Loading schedulers from {schedulers_file}")
            with open(schedulers_file) as f:
                schedulers = json.load(f)
            
            for s in schedulers:
                # Map JSON field names to model field names
                in_scope_value = s.get("inScope")
                # Convert 1/0 to boolean if needed
                if in_scope_value is not None:
                    in_scope_value = bool(in_scope_value) if isinstance(in_scope_value, int) else in_scope_value
                
                scheduler_data = {
                    "name": s.get("name"),
                    "product": s.get("product"),
                    "owner": s.get("owner"),
                    "in_scope": in_scope_value,  # Map inScope to in_scope
                    "score": s.get("score"),
                    "link": s.get("link"),
                    "description": s.get("description"),
                    "features": s.get("features"),
                }
                scheduler = models.Scheduler(**scheduler_data)
                db.add(scheduler)
            
            db.commit()
            print(f"✅ Imported {len(schedulers)} schedulers")
        else:
            print(f"⏭️  Skipping schedulers import (already exist: {existing_schedulers})")
        
        print("🎉 Data imported successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error importing data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    import_data()

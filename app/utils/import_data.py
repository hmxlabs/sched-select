import json
from sqlalchemy.orm import Session
from app import models, database

def import_data():
    db: Session = next(database.get_db())

    # Load Answer Types
    with open("data/answers.json") as f:
        answers = json.load(f)
    for key, value in answers.items():
        answer = models.AnswerType(key=key, type=value["type"], options=value["options"])
        db.add(answer)

    db.commit()

    # Load Questions
    with open("data/questions.json") as f:
        questions = json.load(f)
    for q in questions:
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

    # Load Schedulers
    with open("data/schedulers.json") as f:
        schedulers = json.load(f)
    for s in schedulers:
        scheduler = models.Scheduler(**s)
        db.add(scheduler)

    db.commit()
    db.close()
    print("✅ Data imported successfully!")

if __name__ == "__main__":
    import_data()

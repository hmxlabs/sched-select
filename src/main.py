from fastapi import FastAPI
from .db import Base, engine
from .routers import schedulers, questions, answers

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Scheduler Selection API")

app.include_router(schedulers.router)
app.include_router(questions.router)
app.include_router(answers.router)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from .routers import schedulers, questions, answers, user_answer_router

# Import models to ensure they're registered with Base
from . import models  # noqa: F401

app = FastAPI(title="Scheduler Selection API")

# Add CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Create database tables on startup"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️  Warning: Could not create database tables: {e}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Scheduler Selection API",
        "endpoints": {
            "questions": "/questions",
            "answers": "/answers",
            "schedulers": "/schedulers",
            "user_answers": "/user-answers",
            "docs": "/docs"
        }
    }

app.include_router(schedulers.router)
app.include_router(questions.router)
app.include_router(answers.router)
app.include_router(user_answer_router.router)

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Prefer explicit DATABASE_URL if provided (useful for cloud providers)
DATABASE_URL = os.getenv("DATABASE_URL")

# If DATABASE_URL is not set, try to construct it from individual DB variables
if not DATABASE_URL:
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME")
    
    if db_user and db_password and db_name:
        DATABASE_URL = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        print(f"✅ Constructed DATABASE_URL from environment variables")
    else:
        # Fallback to SQLite for development
        DATABASE_URL = "sqlite:///./scheduler.db"
        print("⚠️  DATABASE_URL not set. Using SQLite database: scheduler.db")

# SQLAlchemy engine (Postgres or SQLite)
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    future=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
Base = declarative_base()

# FastAPI dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

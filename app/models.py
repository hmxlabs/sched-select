from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, Text, ForeignKey, func
from sqlalchemy.orm import relationship
from .db import Base

class Scheduler(Base):
    __tablename__ = "schedulers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    product = Column(String, nullable=True)
    owner = Column(String, nullable=True)
    in_scope = Column(Boolean, nullable=True)
    score = Column(String, nullable=True)
    link = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    features = Column(JSON, nullable=True)

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    hint = Column(String)
    key = Column(String, unique=True, nullable=False)
    type = Column(String, nullable=False)
    answer_type_id = Column(Integer, ForeignKey("answer_types.id"))
    answer_type = relationship("AnswerType", back_populates="question")

class AnswerType(Base):
    __tablename__ = "answer_types"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, nullable=False)
    type = Column(String, nullable=False)
    options = Column(JSON, nullable=False)

    question = relationship("Question", back_populates="answer_type", uselist=False)

class UserAnswer(Base):
    __tablename__ = "user_answers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=True)
    answers = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
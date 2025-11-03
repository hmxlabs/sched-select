from pydantic import BaseModel
from typing import Dict, Union, List, Optional, Any
from datetime import datetime

class SchedulerBase(BaseModel):
    name: str
    product: Optional[str]
    owner: Optional[str]
    in_scope: Optional[bool]
    score: Optional[str]
    link: Optional[str]
    description: Optional[str]
    features: Optional[dict]

class SchedulerResponse(SchedulerBase):
    id: int
    class Config:
        from_attributes = True


class AnswerTypeBase(BaseModel):
    key: str
    type: str
    options: Any

class AnswerTypeResponse(AnswerTypeBase):
    id: int
    class Config:
        from_attributes = True


class QuestionBase(BaseModel):
    question: str
    hint: Optional[str]
    key: str
    type: str

class QuestionResponse(QuestionBase):
    id: int
    answer_type: Optional[AnswerTypeResponse]
    class Config:
        from_attributes = True

class UserAnswerCreate(BaseModel):
    user_id: Optional[str] = None
    answers: Dict[str, Union[bool, int, str, List[str]]]

class UserAnswerResponse(UserAnswerCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
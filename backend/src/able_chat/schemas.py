from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class AbleChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    session_id: Optional[str] = Field(default=None, max_length=64)


class AbleChatUser(BaseModel):
    user_id: str
    email: Optional[str] = None
    display_name: Optional[str] = None


class AbleChatMessageResponse(BaseModel):
    id: int
    session_id: str
    title: str
    user_message: str
    assistant_message: str
    provider: Optional[str] = None
    model: Optional[str] = None
    created_at: datetime


class AbleChatResponse(BaseModel):
    session_id: str
    title: str
    user: AbleChatUser
    message: AbleChatMessageResponse


class AbleChatHistoryItem(BaseModel):
    id: int
    user_message: str
    assistant_message: str
    provider: Optional[str] = None
    model: Optional[str] = None
    created_at: datetime


class AbleChatSessionHistory(BaseModel):
    session_id: str
    title: str
    preview: str
    message_count: int
    started_at: datetime
    last_message_at: datetime
    messages: List[AbleChatHistoryItem]


class AbleChatHistoryResponse(BaseModel):
    user: AbleChatUser
    sessions: List[AbleChatSessionHistory]

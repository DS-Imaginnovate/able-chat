from datetime import datetime

from sqlalchemy import Column, DateTime, Index, Integer, String, Text

from src.database import Base


class AbleChatHistory(Base):
    __tablename__ = 'able_chat_history'

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(64), nullable=False, index=True)
    external_user_id = Column(String(128), nullable=False, index=True)
    user_email = Column(String(255), nullable=True)
    user_display_name = Column(String(255), nullable=True)
    title = Column(String(255), nullable=False)
    user_message = Column(Text, nullable=False)
    assistant_message = Column(Text, nullable=False)
    provider = Column(String(64), nullable=True)
    model = Column(String(255), nullable=True)
    input_tokens = Column(Integer, nullable=False, default=0)
    output_tokens = Column(Integer, nullable=False, default=0)
    response_time_ms = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    __table_args__ = (
        Index('ix_able_chat_history_user_session_created', 'external_user_id', 'session_id', 'created_at'),
    )

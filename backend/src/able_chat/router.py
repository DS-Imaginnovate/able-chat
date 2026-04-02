from collections import OrderedDict

from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.orm import Session

from src.able_chat.auth import resolve_external_user
from src.able_chat.models import AbleChatHistory
from src.able_chat.schemas import (
    AbleChatHistoryItem,
    AbleChatHistoryResponse,
    AbleChatMessageResponse,
    AbleChatRequest,
    AbleChatResponse,
    AbleChatSessionHistory,
    AbleChatUser,
)
from src.able_chat.service import able_chat_llm_service, build_session_title, generate_session_id
from src.database import get_db

router = APIRouter(prefix='/able', tags=['able-chat'])


@router.post('/chat', response_model=AbleChatResponse)
async def start_or_continue_chat(
    payload: AbleChatRequest,
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    current_user = await resolve_external_user(authorization)

    session_id = payload.session_id or generate_session_id()
    existing_session = (
        db.query(AbleChatHistory)
        .filter(
            AbleChatHistory.external_user_id == current_user['user_id'],
            AbleChatHistory.session_id == session_id,
        )
        .order_by(AbleChatHistory.created_at.asc(), AbleChatHistory.id.asc())
        .all()
    )

    title = existing_session[0].title if existing_session else build_session_title(payload.message)
    history = [
        {'user_message': row.user_message, 'assistant_message': row.assistant_message}
        for row in existing_session
    ]
    llm_result = await able_chat_llm_service.answer(payload.message, history, current_user)

    record = AbleChatHistory(
        session_id=session_id,
        external_user_id=current_user['user_id'],
        user_email=current_user['email'],
        user_display_name=current_user['display_name'],
        title=title,
        user_message=payload.message,
        assistant_message=llm_result.text,
        provider=llm_result.provider,
        model=llm_result.model,
        input_tokens=llm_result.input_tokens,
        output_tokens=llm_result.output_tokens,
        response_time_ms=llm_result.response_time_ms,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return AbleChatResponse(
        session_id=session_id,
        title=title,
        user=AbleChatUser(
            user_id=current_user['user_id'],
            email=current_user['email'],
            display_name=current_user['display_name'],
        ),
        message=AbleChatMessageResponse(
            id=record.id,
            session_id=record.session_id,
            title=record.title,
            user_message=record.user_message,
            assistant_message=record.assistant_message,
            provider=record.provider,
            model=record.model,
            created_at=record.created_at,
        ),
    )


@router.get('/chat/history', response_model=AbleChatHistoryResponse)
async def get_chat_history(
    authorization: str | None = Header(default=None),
    limit_sessions: int = Query(default=20, ge=1, le=100),
    limit_messages: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    current_user = await resolve_external_user(authorization)

    rows = (
        db.query(AbleChatHistory)
        .filter(AbleChatHistory.external_user_id == current_user['user_id'])
        .order_by(AbleChatHistory.created_at.desc(), AbleChatHistory.id.desc())
        .all()
    )

    sessions_map = OrderedDict()
    for row in rows:
        if row.session_id not in sessions_map:
            if len(sessions_map) >= limit_sessions:
                continue
            sessions_map[row.session_id] = []
        sessions_map[row.session_id].append(row)

    sessions = []
    for session_id, session_rows in sessions_map.items():
        session_started_row = session_rows[-1]
        session_latest_row = session_rows[0]
        ordered_rows = list(reversed(session_rows[:limit_messages]))
        preview = session_started_row.user_message or session_started_row.assistant_message

        sessions.append(
            AbleChatSessionHistory(
                session_id=session_id,
                title=session_started_row.title,
                preview=preview[:120],
                message_count=len(session_rows),
                started_at=session_started_row.created_at,
                last_message_at=session_latest_row.created_at,
                messages=[
                    AbleChatHistoryItem(
                        id=row.id,
                        user_message=row.user_message,
                        assistant_message=row.assistant_message,
                        provider=row.provider,
                        model=row.model,
                        created_at=row.created_at,
                    )
                    for row in ordered_rows
                ],
            )
        )

    return AbleChatHistoryResponse(
        user=AbleChatUser(
            user_id=current_user['user_id'],
            email=current_user['email'],
            display_name=current_user['display_name'],
        ),
        sessions=sessions,
    )

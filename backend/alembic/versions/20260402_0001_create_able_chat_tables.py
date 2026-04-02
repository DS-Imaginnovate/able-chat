"""create able chat tables

Revision ID: 20260402_0001
Revises:
Create Date: 2026-04-02 00:00:00
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260402_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "able_chat_history",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("session_id", sa.String(length=64), nullable=False),
        sa.Column("external_user_id", sa.String(length=128), nullable=False),
        sa.Column("user_email", sa.String(length=255), nullable=True),
        sa.Column("user_display_name", sa.String(length=255), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("user_message", sa.Text(), nullable=False),
        sa.Column("assistant_message", sa.Text(), nullable=False),
        sa.Column("provider", sa.String(length=64), nullable=True),
        sa.Column("model", sa.String(length=255), nullable=True),
        sa.Column("input_tokens", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("output_tokens", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("response_time_ms", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_able_chat_history_created_at"), "able_chat_history", ["created_at"], unique=False)
    op.create_index(op.f("ix_able_chat_history_external_user_id"), "able_chat_history", ["external_user_id"], unique=False)
    op.create_index(op.f("ix_able_chat_history_id"), "able_chat_history", ["id"], unique=False)
    op.create_index(
        "ix_able_chat_history_user_session_created",
        "able_chat_history",
        ["external_user_id", "session_id", "created_at"],
        unique=False,
    )
    op.create_index(op.f("ix_able_chat_history_session_id"), "able_chat_history", ["session_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_able_chat_history_session_id"), table_name="able_chat_history")
    op.drop_index("ix_able_chat_history_user_session_created", table_name="able_chat_history")
    op.drop_index(op.f("ix_able_chat_history_id"), table_name="able_chat_history")
    op.drop_index(op.f("ix_able_chat_history_external_user_id"), table_name="able_chat_history")
    op.drop_index(op.f("ix_able_chat_history_created_at"), table_name="able_chat_history")
    op.drop_table("able_chat_history")

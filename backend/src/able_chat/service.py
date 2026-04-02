import asyncio
import uuid
from typing import List

from src.common.services.llm.gemini_provider import GeminiProvider
from src.common.services.llm.base import LLMResult

ABLE_SYSTEM_PROMPT = """You are Able, FleetEnable's AI logistics copilot.

Your role:
- Help users with FleetEnable workflows, logistics operations, shipment/order handling, warehouse flows, and related business questions.
- Answer clearly, practically, and with a bias toward operational usefulness.
- When asked about FleetEnable capabilities, use this application context: FleetEnable supports PDF extraction, order processing, EOD workflows, email ingestion, CSV upload flows, and logistics document handling.
- If a user asks something outside FleetEnable, logistics, supply chain, order management, warehousing, transportation, or shipping operations, politely steer the answer back to those domains.
- Be honest when context is missing. Do not invent internal FleetEnable policies or customer-specific facts.

Response style:
- Be concise but helpful.
- Prefer actionable steps, checklists, or bullets when useful.
- If the user asks how to do something in FleetEnable, explain the likely workflow in plain language.
"""


def build_session_title(message: str) -> str:
    normalized = ' '.join(message.strip().split())
    if len(normalized) <= 60:
        return normalized
    return f"{normalized[:57].rstrip()}..."


def build_chat_prompt(message: str, history: List[dict], user_context: dict) -> str:
    history_lines = []
    for item in history[-8:]:
        history_lines.append(f"User: {item['user_message']}")
        history_lines.append(f"Able: {item['assistant_message']}")

    history_block = '\n'.join(history_lines) if history_lines else 'No prior conversation.'
    user_context_line = (
        f"Current user: {user_context.get('display_name') or user_context.get('email') or user_context['user_id']}"
    )

    return (
        f"{ABLE_SYSTEM_PROMPT}\n\n"
        f"{user_context_line}\n\n"
        f"Conversation so far:\n{history_block}\n\n"
        f"Latest user message:\n{message}\n\n"
        'Answer as Able.'
    )


class AbleChatLLMService:
    def __init__(self):
        self._provider = None

    @property
    def provider(self) -> GeminiProvider:
        if self._provider is None:
            self._provider = GeminiProvider()
        return self._provider

    async def answer(self, message: str, history: List[dict], user_context: dict) -> LLMResult:
        prompt = build_chat_prompt(message, history, user_context)
        return await asyncio.to_thread(self.provider.generate_text, prompt, 1024, 0.2)


able_chat_llm_service = AbleChatLLMService()


def generate_session_id() -> str:
    return uuid.uuid4().hex

import asyncio
import logging
import time

import httpx
from google import genai
from google.auth.credentials import Credentials
from google.genai import types
from google.oauth2 import service_account

from src.common.services.llm.base import LLMProvider, LLMResult
from src.config.secrets import get_secrets_config

logger = logging.getLogger(__name__)
_RETRYABLE_EXCEPTIONS = None
_CLOUD_PLATFORM_SCOPE = 'https://www.googleapis.com/auth/cloud-platform'
_VERTEX_AI_LOCATION = 'us-central1'


class RetryableGeminiError(Exception):
    """Wrap retryable SDK errors that are not exposed as dedicated exception types."""


def _get_retryable_exceptions():
    global _RETRYABLE_EXCEPTIONS
    if _RETRYABLE_EXCEPTIONS is None:
        from google.genai.errors import ServerError

        _RETRYABLE_EXCEPTIONS = (
            ServerError,
            RetryableGeminiError,
            httpx.HTTPError,
            ConnectionError,
            TimeoutError,
        )
    return _RETRYABLE_EXCEPTIONS


class GeminiProvider(LLMProvider):
    def __init__(self):
        super().__init__()
        self.secrets = get_secrets_config()
        self.credentials, self.project_id = self._resolve_credentials()
        self.model_name = self.secrets.VERTEX_AI_MODEL
        self.client = genai.Client(
            vertexai=True,
            credentials=self.credentials,
            project=self.project_id,
            location=_VERTEX_AI_LOCATION,
            http_options=types.HttpOptions(api_version='v1'),
        )
        self.safety_settings = [
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold=types.HarmBlockThreshold.OFF,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=types.HarmBlockThreshold.OFF,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold=types.HarmBlockThreshold.OFF,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold=types.HarmBlockThreshold.OFF,
            ),
        ]

        logger.info(
            'Initialized Gemini provider with model=%s project=%s location=%s',
            self.model_name,
            self.project_id,
            _VERTEX_AI_LOCATION,
        )

    def _resolve_credentials(self) -> tuple[Credentials, str]:
        if not self.secrets.VERTEX_AI_SERVICE_ACCOUNT_FILE:
            raise ValueError(
                'VERTEX_AI_SERVICE_ACCOUNT_FILE must be configured when initializing the Gemini provider.'
            )

        credentials = service_account.Credentials.from_service_account_file(
            self.secrets.VERTEX_AI_SERVICE_ACCOUNT_FILE,
            scopes=[_CLOUD_PLATFORM_SCOPE],
        )
        project_id = credentials.project_id
        logger.debug(
            'Using service account file credentials from %s',
            self.secrets.VERTEX_AI_SERVICE_ACCOUNT_FILE,
        )

        if not project_id:
            raise ValueError(
                'The configured Vertex AI service account file must include a project_id.'
            )

        return credentials, project_id

    def _get_generation_config(
        self,
        max_tokens: int = 1024,
        temperature: float = 0.2,
        include_stop_sequences: bool = False,
    ) -> types.GenerateContentConfig:
        stop_sequences = None
        if include_stop_sequences:
            stop_sequences = ['\n\n###', '\n\nNote:', '\n\nInstruction:']

        return types.GenerateContentConfig(
            temperature=temperature,
            topP=0.8,
            topK=40,
            maxOutputTokens=max_tokens,
            stopSequences=stop_sequences,
            safetySettings=self.safety_settings,
        )

    def generate_text(
        self,
        prompt: str,
        max_tokens: int = 1024,
        temperature: float = 0.2,
    ) -> LLMResult:
        def _call():
            started_at = time.time()
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=self._get_generation_config(
                        max_tokens=max_tokens,
                        temperature=temperature,
                        include_stop_sequences=False,
                    ),
                )
            except genai.errors.ClientError as exc:
                if exc.code in {408, 429}:
                    raise RetryableGeminiError(str(exc)) from exc
                raise
            elapsed_ms = int((time.time() - started_at) * 1000)
            usage = getattr(response, 'usage_metadata', None)
            return LLMResult(
                text=(getattr(response, 'text', '') or '').strip(),
                input_tokens=getattr(usage, 'prompt_token_count', 0) or 0,
                output_tokens=getattr(usage, 'candidates_token_count', 0) or 0,
                model=self.model_name,
                provider='gemini',
                response_time_ms=elapsed_ms,
            )

        return self.call_with_retry(
            _call,
            description=f'Gemini generate_text (model={self.model_name})',
            retryable_exceptions=_get_retryable_exceptions(),
        )

    async def health_check(self) -> bool:
        try:
            loop = asyncio.get_running_loop()
            await asyncio.wait_for(
                loop.run_in_executor(None, self._generate_test_content),
                timeout=10,
            )
            return True
        except Exception as exc:
            logger.warning(f'Gemini health check failed: {exc}')
            return False

    def get_model_name(self) -> str:
        return self.model_name

    def _generate_test_content(self):
        return self.client.models.generate_content(
            model=self.model_name,
            contents='test',
            config=self._get_generation_config(max_tokens=8, temperature=0),
        )

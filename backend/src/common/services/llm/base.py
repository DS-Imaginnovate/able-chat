from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Callable, Type, TypeVar, Tuple
import logging
import random
import time

logger = logging.getLogger(__name__)
T = TypeVar('T')


@dataclass(frozen=True, slots=True)
class LLMResult:
    text: str
    input_tokens: int = 0
    output_tokens: int = 0
    model: str = ''
    provider: str = ''
    response_time_ms: int = 0


class LLMProvider(ABC):
    @abstractmethod
    async def health_check(self) -> bool:
        pass

    def get_provider_name(self) -> str:
        return self.__class__.__name__

    def get_model_name(self) -> str:
        return 'unknown'

    @staticmethod
    def call_with_retry(
        func: Callable[[], T],
        description: str,
        retryable_exceptions: Tuple[Type[BaseException], ...],
        max_retries: int = 3,
        base_delay: float = 2,
        max_delay: float = 30,
    ) -> T:
        last_exception = None
        for attempt in range(1, max_retries + 1):
            try:
                return func()
            except retryable_exceptions as exc:
                last_exception = exc
                if attempt == max_retries:
                    logger.error(f'{description}: all retries exhausted. Last error: {exc}')
                    raise
                delay = min(base_delay * (2 ** (attempt - 1)), max_delay)
                jitter = random.uniform(0, delay * 0.3)
                wait = delay + jitter
                logger.warning(
                    f'{description}: attempt {attempt}/{max_retries} failed '
                    f'({type(exc).__name__}: {exc}). Retrying in {wait:.1f}s...'
                )
                time.sleep(wait)
            except Exception:
                logger.exception(f'{description}: non-retryable error')
                raise
        raise last_exception

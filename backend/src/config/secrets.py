from functools import lru_cache
from typing import Optional
import logging
import os

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class SecretsConfig(BaseSettings):
    VERTEX_AI_SERVICE_ACCOUNT_FILE: Optional[str] = Field(default=None)
    VERTEX_AI_MODEL: str = Field(default='gemini-2.5-flash-lite')

    SQLALCHEMY_DATABASE_URL: str = Field(default=None)

    FLEETENABLE_AUTH_BASE_URL: Optional[str] = Field(default=None)
    STATIC_CLIENT_ID: Optional[str] = Field(default=None)
    STATIC_CLIENT_SECRET: Optional[str] = Field(default=None)

    ENVIRONMENT: str = Field(default='development')
    DEBUG: bool = Field(default=False)
    LOG_LEVEL: str = Field(default='INFO')
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra='allow',
    )

    @field_validator('VERTEX_AI_SERVICE_ACCOUNT_FILE', mode='before')
    @classmethod
    def resolve_service_account_path(cls, value):
        if value:
            return value

        default_path = os.path.join(os.getcwd(), 'secrets', 'service-account.json')
        if os.path.exists(default_path):
            return default_path

        alt_paths = [
            os.path.join(os.getcwd(), 'secrets', 'credentials.json'),
            os.path.join(os.getcwd(), 'credentials.json'),
        ]
        for path in alt_paths:
            if os.path.exists(path):
                return path

        return None

    @field_validator('ENVIRONMENT')
    @classmethod
    def validate_environment(cls, value):
        valid_envs = ['development', 'beta', 'staging', 'production', 'test']
        value = value.lower()
        if value not in valid_envs:
            raise ValueError(f'ENVIRONMENT must be one of {valid_envs}')
        return value

    @field_validator('LOG_LEVEL')
    @classmethod
    def validate_log_level(cls, value):
        valid_levels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
        value = value.upper()
        if value not in valid_levels:
            raise ValueError(f'LOG_LEVEL must be one of {valid_levels}')
        return value


@lru_cache(maxsize=1)
def get_secrets_config() -> SecretsConfig:
    config = SecretsConfig()
    logger.info('Loaded backend secrets configuration')
    return config

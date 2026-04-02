from urllib.parse import urljoin

import httpx
from fastapi import HTTPException, status

from src.config.secrets import get_secrets_config

_secrets = get_secrets_config()
CURRENT_USER_PATH = '/api/v1/users/me'


def _extract_user_value(payload: dict, *keys: str):
    for key in keys:
        value = payload.get(key)
        if value:
            return str(value)
    return None


async def resolve_external_user(authorization: str | None) -> dict:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Authorization header is required',
        )

    if not _secrets.FLEETENABLE_AUTH_BASE_URL:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='FLEETENABLE_AUTH_BASE_URL is not configured',
        )

    target_url = urljoin(
        f"{_secrets.FLEETENABLE_AUTH_BASE_URL.rstrip('/')}/",
        CURRENT_USER_PATH.lstrip('/'),
    )

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                target_url,
                headers={
                    'Authorization': authorization,
                    'Accept': 'application/json',
                },
            )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f'Failed to reach external authentication service: {exc}',
        ) from exc

    try:
        payload = response.json()
    except ValueError:
        payload = {'detail': response.text}

    if response.is_error:
        raise HTTPException(status_code=response.status_code, detail=payload)

    user_id = _extract_user_value(payload, 'id', '_id', 'user_id', 'uid', 'email', 'username')
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail='Unable to resolve user identity from authentication service',
        )

    return {
        'user_id': user_id,
        'email': _extract_user_value(payload, 'email'),
        'display_name': _extract_user_value(
            payload,
            'name',
            'full_name',
            'display_name',
            'username',
            'mobile',
            'phone',
            'email',
        ),
        'raw': payload,
    }

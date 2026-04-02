from urllib.parse import urljoin

import httpx
from fastapi import APIRouter, Header, HTTPException, Request, status
from fastapi.responses import JSONResponse

from src.auth.schemas import UserAccessTokenRequest
from src.config.secrets import get_secrets_config

external_auth_router = APIRouter(tags=["authentication"])

_secrets = get_secrets_config()
USER_ACCESS_TOKEN_PATH = "/api/authentication/user_access_token"
CURRENT_USER_PATH = "/api/v1/users/me"


def _build_auth_url(path: str) -> str:
    if not _secrets.FLEETENABLE_AUTH_BASE_URL:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="FLEETENABLE_AUTH_BASE_URL is not configured",
        )

    return urljoin(
        f"{_secrets.FLEETENABLE_AUTH_BASE_URL.rstrip('/')}/",
        path.lstrip("/"),
    )


@external_auth_router.post("/api/authentication/user_access_token")
async def user_access_token(data: UserAccessTokenRequest):
    if not _secrets.STATIC_CLIENT_ID or not _secrets.STATIC_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="STATIC_CLIENT_ID or STATIC_CLIENT_SECRET is not configured",
        )

    payload = {
        "client_id": _secrets.STATIC_CLIENT_ID,
        "client_secret": _secrets.STATIC_CLIENT_SECRET,
        "username": data.username,
        "password": data.password,
    }
    target_url = _build_auth_url(USER_ACCESS_TOKEN_PATH)

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(target_url, json=payload)
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to reach external authentication service: {exc}",
        ) from exc

    try:
        response_body = response.json()
    except ValueError:
        response_body = {"detail": response.text}

    if response.is_error:
        raise HTTPException(status_code=response.status_code, detail=response_body)

    return response_body


@external_auth_router.get("/api/v1/users/me")
async def get_external_current_user(
    request: Request,
    authorization: str | None = Header(default=None),
):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required",
        )

    headers = {
        "Authorization": authorization,
        "Accept": "application/json",
    }

    incoming_cookie = request.headers.get("cookie")
    if incoming_cookie:
        headers["Cookie"] = incoming_cookie

    target_url = _build_auth_url(CURRENT_USER_PATH)

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(target_url, headers=headers)
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to reach external authentication service: {exc}",
        ) from exc

    try:
        response_body = response.json()
    except ValueError:
        response_body = {"detail": response.text}

    if response.is_error:
        raise HTTPException(status_code=response.status_code, detail=response_body)

    downstream_headers = {}
    upstream_set_cookie = response.headers.get("set-cookie")
    if upstream_set_cookie:
        downstream_headers["set-cookie"] = upstream_set_cookie

    return JSONResponse(
        content=response_body,
        status_code=response.status_code,
        headers=downstream_headers,
    )

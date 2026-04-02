# Able Chat Backend

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -e .
copy .env.example .env
```

Place your Vertex AI service account JSON at `secrets/service-account.json`, or update `VERTEX_AI_SERVICE_ACCOUNT_FILE` in `.env`.

Start the API:

```bash
uvicorn app:app --reload
```

Run database migrations:

```bash
alembic upgrade head
```

Create a new migration after model changes:

```bash
alembic revision --autogenerate -m "describe_change"
```

## Required configuration

- `SQLALCHEMY_DATABASE_URL`
- `VERTEX_AI_SERVICE_ACCOUNT_FILE`
- `FLEETENABLE_AUTH_BASE_URL`

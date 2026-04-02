from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.able_chat.router import router as able_chat_router
from src.auth.router import external_auth_router
from src.config import settings

load_dotenv()

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(external_auth_router)
app.include_router(able_chat_router, prefix='/api')


@app.get('/')
async def root():
    return {'message': settings.APP_NAME, 'status': 'running', 'version': settings.APP_VERSION}


@app.get('/health')
async def health():
    return {'status': 'healthy'}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="info"
    )

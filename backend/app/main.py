from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import upload

app = FastAPI(title='SmartSchedule API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(upload.router, prefix="/upload", tags=["Upload"])

@app.get('/')
def health_check():
    return {'status': 'healthy', 'service': 'SmartSchedule API'}

"""
🌱 KISANSETU FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .config import settings
from .database import engine, Base
from .routers import scans, plant_rec, risk, weather, iot, gis, expert, reports

# Auto-create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FastAPI Backend for 🌱 KISANSETU Smart Crop Health Platform",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(scans.router, prefix=settings.API_V1_STR)
app.include_router(plant_rec.router, prefix=settings.API_V1_STR)
app.include_router(risk.router, prefix=settings.API_V1_STR)
app.include_router(weather.router, prefix=settings.API_V1_STR)
app.include_router(iot.router, prefix=settings.API_V1_STR)
app.include_router(gis.router, prefix=settings.API_V1_STR)
app.include_router(expert.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "ONLINE",
        "docs": "/docs",
        "health": "OK"
    }

@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "database": "CONNECTED"}

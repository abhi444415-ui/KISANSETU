"""
🌱 KISANSETU Backend Configuration Module
"""

import os

class Settings:
    PROJECT_NAME: str = "🌱 KISANSETU Smart Crop Health Platform API"
    VERSION: str = "2.4.0"
    API_V1_STR: str = "/api"
    
    # Database Settings (SQLite fallback for local demo, PostgreSQL + PostGIS supported)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./kisansetu.db")
    
    # AI Engine Thresholds
    CONFIDENCE_THRESHOLD_HIGH: float = 0.85
    CONFIDENCE_THRESHOLD_LOW: float = 0.60

settings = Settings()

"""
🌱 Crop Health Scans API Router
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas import ScanRequest, ScanResponse
from ..ai_engine import ai_engine
from ..database import get_db

router = APIRouter(prefix="/scans", tags=["Crop Scans"])

@router.post("/analyze", response_model=ScanResponse)
def analyze_crop_health(request: ScanRequest, db: Session = Depends(get_db)):
    """
    Analyze crop leaf symptoms with Computer Vision AI
    """
    prediction = ai_engine.predict_disease(request.crop)
    return prediction

@router.get("/history")
def get_scan_history(db: Session = Depends(get_db)):
    """
    Fetch recent crop scan history
    """
    return [
        {"id": "SCN-101", "crop": "Tomato", "disease": "Early Blight", "confidence": 91.0, "risk": 89, "date": "2 hours ago"},
        {"id": "SCN-102", "crop": "Rice", "disease": "Brown Spot", "confidence": 88.0, "risk": 72, "date": "Yesterday"},
        {"id": "SCN-103", "crop": "Wheat", "disease": "Powdery Mildew", "confidence": 94.0, "risk": 28, "date": "3 days ago"}
    ]

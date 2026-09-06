"""
🌱 KISANSETU Pydantic Validation Schemas
"""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ScanRequest(BaseModel):
    crop: str
    variety: Optional[str] = None
    growth_stage: Optional[str] = "vegetative"
    image_base64: Optional[str] = None
    location: Optional[str] = "Rampur"

class ScanResponse(BaseModel):
    scan_id: str
    crop: str
    predicted_disease: str
    scientific_name: str
    confidence: float
    risk_level: str
    symptoms: List[str]
    recommendation: str

class RiskCalculationRequest(BaseModel):
    crop: str
    image_score: float = 35.0
    weather_score: float = 20.0
    pest_trap_score: float = 20.0
    historical_score: float = 10.0
    crop_stage_score: float = 10.0
    soil_score: float = 5.0

class RiskCalculationResponse(BaseModel):
    composite_risk_score: int
    risk_level: str
    contributing_factors: dict
    explanation: List[str]

class PlantRecRequest(BaseModel):
    image_base64: Optional[str] = None
    specimen_id: Optional[str] = "plant_tomato"

class PlantRecResponse(BaseModel):
    id: str
    common_name: str
    botanical_name: str
    family: str
    type: str
    confidence: float
    characteristics: List[str]
    ideal_soil: str
    optimal_temp: str
    economic_importance: str
    status: str

class TelemetryData(BaseModel):
    farm_id: str
    temperature: float
    humidity: float
    soil_moisture: float
    trap_count: int

class ExpertReviewAction(BaseModel):
    scan_id: str
    expert_id: str
    diagnosis: str
    status: str  # confirmed, rejected, lab_referred
    comments: Optional[str] = None

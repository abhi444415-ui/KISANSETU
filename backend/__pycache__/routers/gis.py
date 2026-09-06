"""
🗺 GIS Hotspots API Router
"""

from fastapi import APIRouter

router = APIRouter(prefix="/gis", tags=["GIS Surveillance"])

@router.get("/hotspots")
def get_gis_hotspots():
    """
    Fetch Spatial GIS Hotspots (PostGIS GeoJSON format)
    """
    return [
        {"id": "MAP-1", "village": "Rampur", "lat": 29.6857, "lng": 76.9905, "crop": "Rice & Tomato", "reports": 23, "main_issue": "Rice Brown Spot & Early Blight", "risk_score": 86, "trend": "↑ Increasing"},
        {"id": "MAP-2", "village": "Shivpur", "lat": 29.7120, "lng": 77.0150, "crop": "Tomato", "reports": 14, "main_issue": "Tomato Early Blight", "risk_score": 72, "trend": "↑ Increasing"},
        {"id": "MAP-3", "village": "Lakshmi Nagar", "lat": 29.6510, "lng": 76.9540, "crop": "Wheat", "reports": 8, "main_issue": "Yellow Rust Warning", "risk_score": 51, "trend": "→ Stable"}
    ]

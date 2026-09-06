"""
🌦 Weather Intelligence API Router
"""

from fastapi import APIRouter

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("/forecast")
def get_weather_forecast():
    """
    Get 7-day agro-weather forecast & disease risk
    """
    return {
        "current": {"temp": "29°C", "humidity": "84%", "rainfall": "18 mm", "wind_speed": "11 km/h", "disease_risk": "CRITICAL"},
        "forecast": [
            {"day": "Today", "temp": "29°C", "humidity": "84%", "rain": "18 mm", "risk": "Critical"},
            {"day": "Mon", "temp": "30°C", "humidity": "82%", "rain": "12 mm", "risk": "Critical"},
            {"day": "Tue", "temp": "31°C", "humidity": "78%", "rain": "5 mm", "risk": "High"},
            {"day": "Wed", "temp": "32°C", "humidity": "71%", "rain": "0 mm", "risk": "Moderate"},
            {"day": "Thu", "temp": "29°C", "humidity": "88%", "rain": "25 mm", "risk": "Critical"}
        ]
    }

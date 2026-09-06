"""
🪤 IoT Telemetry & Pest Traps API Router
"""

from fastapi import APIRouter
from ..schemas import TelemetryData

router = APIRouter(prefix="/iot", tags=["IoT & Pest Traps"])

@router.post("/telemetry")
def receive_telemetry(data: TelemetryData):
    """
    Ingest real-time ESP32 telemetry & pest trap count
    """
    return {"status": "SUCCESS", "ingested_at": "NOW", "trap_alert": data.trap_count > 15}

@router.get("/nodes")
def get_sensor_nodes():
    return [
        {"id": "SNS-1", "name": "Field A Weather Node", "temp": "29.4 °C", "humidity": "84%", "soil_moisture": "38%", "trap_count": 18, "status": "Online"},
        {"id": "SNS-2", "name": "Tomato Plot Gateway", "temp": "31.1 °C", "humidity": "89%", "soil_moisture": "44%", "trap_count": 24, "status": "Online"}
    ]

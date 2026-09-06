"""
📈 Analytics & Reports API Router
"""

from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/summary")
def get_reports_summary():
    return {
        "total_reports": 12450,
        "high_risk_count": 1240,
        "active_hotspots": 86,
        "expert_validated_pct": 74.0,
        "districts": [
            {"district": "Karnal", "scans": 1420, "avg_risk": 86, "efficacy": "92%"},
            {"district": "Shivpur", "scans": 890, "avg_risk": 72, "efficacy": "88%"}
        ]
    }

@router.get("/export/{format_type}")
def export_report(format_type: str):
    return JSONResponse(content={
        "status": "GENERATED",
        "file_name": f"KISANSETU_Surveillance_Report.{format_type.lower()}",
        "format": format_type.upper()
    })

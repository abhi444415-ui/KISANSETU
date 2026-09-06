"""
👨🔬 Agriculture Expert Validation API Router
"""

from fastapi import APIRouter
from ..schemas import ExpertReviewAction

router = APIRouter(prefix="/expert", tags=["Expert Validation"])

@router.get("/cases")
def get_pending_cases():
    """
    Fetch pending cases requiring expert validation
    """
    return [
        {"id": "EXP-881", "farmer": "Rajesh Kumar", "field": "Field A", "crop": "Rice", "ai_diagnosis": "Rice Brown Spot", "confidence": 64.0, "status": "PENDING_EXPERT"},
        {"id": "EXP-882", "farmer": "Sunil Verma", "field": "North Plot", "crop": "Tomato", "ai_diagnosis": "Early Blight", "confidence": 91.0, "status": "LAB_REFERRED"}
    ]

@router.post("/validate")
def validate_case(action: ExpertReviewAction):
    """
    Submit expert validation, rejection, or laboratory referral
    """
    return {
        "status": "UPDATED",
        "case_id": action.scan_id,
        "action": action.status,
        "comments": action.comments
    }

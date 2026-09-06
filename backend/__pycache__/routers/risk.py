"""
🧠 Multi-Factor Risk Engine API Router
"""

from fastapi import APIRouter
from ..schemas import RiskCalculationRequest, RiskCalculationResponse
from ..ai_engine import ai_engine

router = APIRouter(prefix="/risk", tags=["Risk Engine"])

@router.post("/calculate", response_model=RiskCalculationResponse)
def calculate_crop_risk(request: RiskCalculationRequest):
    """
    Calculate composite multi-factor risk score
    """
    factors = request.dict()
    return ai_engine.calculate_multi_factor_risk(factors)

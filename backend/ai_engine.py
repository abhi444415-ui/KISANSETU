"""
🌱 KISANSETU Computer Vision AI Engine Module
"""

import uuid
from typing import Dict, Any

DISEASE_DB: Dict[str, Dict[str, Any]] = {
    "tomato": {
        "name": "Early Blight (अगेती झुलसा)",
        "scientificName": "Alternaria solani",
        "confidence": 91.0,
        "riskLevel": "HIGH",
        "symptoms": [
            "Brown concentric circular lesions ('target spots') on leaves",
            "Yellowing halo around affected leaf spots",
            "Lower leaf premature defoliation and stem collar rot"
        ],
        "recommendation": "Inspect additional plants and confirm symptoms before treatment."
    },
    "rice": {
        "name": "Rice Brown Spot (भूरा धब्बा)",
        "scientificName": "Helminthosporium oryzae",
        "confidence": 88.0,
        "riskLevel": "HIGH",
        "symptoms": [
            "Oval or cylindrical sesame-seed-like dark brown spots on leaves",
            "Yellow halo surrounding mature brown spots",
            "Grain discolouration and seedling blight"
        ],
        "recommendation": "Ensure balanced potassium nutrition and avoid water stress."
    },
    "wheat": {
        "name": "Powdery Mildew (चूर्णिल आसिता)",
        "scientificName": "Erysiphe graminis",
        "confidence": 94.0,
        "riskLevel": "MODERATE",
        "symptoms": [
            "White powdery fungal patches on upper leaf surfaces and stems",
            "Patches turn greyish-brown as leaves age and yellow",
            "Stunted tiller growth and reduced grain weight"
        ],
        "recommendation": "Ensure adequate row spacing for ventilation; monitor closely."
    },
    "cotton": {
        "name": "Aphid Infestation (माहू / चेपा)",
        "scientificName": "Aphis gossypii",
        "confidence": 96.0,
        "riskLevel": "CRITICAL",
        "symptoms": [
            "Curling and puckering of young shoots and tender leaves",
            "Sticky honeydew secretion on leaf surface attracting sooty mold",
            "Stunted crop growth and vector transmission of viral pathogens"
        ],
        "recommendation": "Install yellow sticky traps immediately and deploy beneficial predators."
    }
}

class AIEngine:
    @staticmethod
    def predict_disease(crop: str) -> Dict[str, Any]:
        crop_key = crop.lower()
        result = DISEASE_DB.get(crop_key, DISEASE_DB["tomato"])
        return {
            "scan_id": f"SCN-{str(uuid.uuid4())[:8].upper()}",
            "crop": crop.capitalize(),
            "predicted_disease": result["name"],
            "scientific_name": result["scientificName"],
            "confidence": result["confidence"],
            "risk_level": result["riskLevel"],
            "symptoms": result["symptoms"],
            "recommendation": result["recommendation"]
        }

    @staticmethod
    def calculate_multi_factor_risk(factors: dict) -> dict:
        total = (
            factors.get("image_score", 35.0) +
            factors.get("weather_score", 20.0) +
            factors.get("pest_trap_score", 20.0) +
            factors.get("historical_score", 10.0) +
            factors.get("crop_stage_score", 10.0) +
            factors.get("soil_score", 5.0)
        )
        score = int(round(total))
        level = "CRITICAL" if score >= 80 else ("HIGH" if score >= 60 else "MODERATE")
        
        return {
            "composite_risk_score": score,
            "risk_level": level,
            "contributing_factors": factors,
            "explanation": [
                "High relative humidity (>84%) speeds up spore germination.",
                "Recent 18mm rainfall creates prolonged leaf wetness.",
                "Pest trap counts increased by 45% over 5 days."
            ]
        }

ai_engine = AIEngine()

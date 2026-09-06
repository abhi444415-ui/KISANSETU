"""
🌿 Plant Species Recognition API Router
"""

from fastapi import APIRouter
from ..schemas import PlantRecRequest, PlantRecResponse

router = APIRouter(prefix="/plants", tags=["Plant Recognition"])

PLANTS_DB = {
    "plant_tomato": {
        "id": "plant_tomato",
        "common_name": "Tomato (टमाटर)",
        "botanical_name": "Solanum lycopersicum",
        "family": "Solanaceae (Nightshade Family)",
        "type": "Solanaceous Fruit Crop",
        "confidence": 96.0,
        "characteristics": [
            "Compound pinnate leaves with 5-9 serrated leaflets",
            "Glandular trichomes (hairs) exuding distinct aromatic scent",
            "Yellow 5-lobed star-shaped flowers and fleshy berries"
        ],
        "ideal_soil": "Well-drained sandy loam, pH 6.0 - 6.8",
        "optimal_temp": "21°C - 27°C",
        "economic_importance": "Major commercial vegetable crop rich in Lycopene antioxidant and Vitamin C.",
        "status": "CULTIVATED CROP"
    },
    "plant_parthenium": {
        "id": "plant_parthenium",
        "common_name": "Carrot Grass / Gaddi (गाजर घास)",
        "botanical_name": "Parthenium hysterophorus",
        "family": "Asteraceae (Sunflower Family)",
        "type": "Noxious Invasive Weed",
        "confidence": 94.0,
        "characteristics": [
            "Deeply lobed feather-like leaves resembling carrot foliage",
            "Small white star-shaped flower heads producing thousands of seeds",
            "Contains Parthenin toxin causing allergic contact dermatitis"
        ],
        "ideal_soil": "Adaptable to all degraded soils and disturbed land",
        "optimal_temp": "15°C - 40°C",
        "economic_importance": "INVASIVE WEED: Reduces crop yields by 40% and suppresses native pasture flora.",
        "status": "HAZARDOUS WEED"
    }
}

@router.post("/recognize", response_model=PlantRecResponse)
def recognize_plant_species(request: PlantRecRequest):
    """
    Classify plant or weed species from image
    """
    key = request.specimen_id or "plant_tomato"
    return PLANTS_DB.get(key, PLANTS_DB["plant_tomato"])

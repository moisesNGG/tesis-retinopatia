from pydantic import BaseModel
from typing import Dict

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    severity: str  # 'none', 'mild', 'moderate', 'severe', 'proliferative'
    details: Dict[str, bool]
    recommendation: str

class PredictionRequest(BaseModel):
    # Placeholder - la imagen vendrá como File en el endpoint
    pass

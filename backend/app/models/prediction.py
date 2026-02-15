from pydantic import BaseModel
from typing import List


class SingleModelResult(BaseModel):
    model_name: str
    prediction: str
    confidence: float
    severity: str
    probabilities: List[float]


class ConsensusResult(BaseModel):
    prediction: str
    severity: str
    confidence: float
    agreement_count: int
    total_models: int
    recommendation: str


class MultiModelPredictionResponse(BaseModel):
    results: List[SingleModelResult]
    consensus: ConsensusResult
    image_filename: str

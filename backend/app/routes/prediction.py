from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.prediction import (
    SingleModelResult,
    ConsensusResult,
    MultiModelPredictionResponse,
)
from app.services.model_service import model_service
from collections import Counter

router = APIRouter(prefix="/predict", tags=["AI Prediction"])


@router.post("/", response_model=MultiModelPredictionResponse)
async def predict_retinopathy(image: UploadFile = File(...)):
    """Endpoint para prediccion de retinopatia diabetica con 5 modelos de IA"""

    if not image.content_type or not image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")

    if model_service.loading:
        raise HTTPException(
            status_code=503,
            detail=f"Los modelos de IA se estan cargando ({model_service.models_loaded_count}/5). Intente de nuevo en unos segundos.",
        )

    if not model_service.loaded:
        raise HTTPException(
            status_code=503,
            detail="Los modelos de IA no pudieron cargarse. Revise los logs del servidor.",
        )

    contents = await image.read()

    raw_results = model_service.predict_all(contents)

    results = [SingleModelResult(**r) for r in raw_results]

    consensus = _compute_consensus(results)

    return MultiModelPredictionResponse(
        results=results,
        consensus=consensus,
        image_filename=image.filename or "imagen.jpg",
    )


def _compute_consensus(results: list[SingleModelResult]) -> ConsensusResult:
    valid = [r for r in results if r.prediction != 'Error']
    total = len(results)

    if not valid:
        return ConsensusResult(
            prediction='Error',
            severity='none',
            confidence=0.0,
            agreement_count=0,
            total_models=total,
            recommendation='No se pudo realizar el analisis. Intente de nuevo.',
        )

    votes = Counter(r.severity for r in valid)
    winner_severity, agreement_count = votes.most_common(1)[0]

    winners = [r for r in valid if r.severity == winner_severity]
    avg_confidence = sum(r.confidence for r in winners) / len(winners)

    winner_idx = ['none', 'mild', 'moderate', 'severe', 'proliferative'].index(winner_severity)
    from app.services.model_service import CLASS_LABELS
    prediction = CLASS_LABELS[winner_idx]

    return ConsensusResult(
        prediction=prediction,
        severity=winner_severity,
        confidence=round(avg_confidence, 4),
        agreement_count=agreement_count,
        total_models=total,
        recommendation=_get_recommendation(winner_severity),
    )


def _get_recommendation(severity: str) -> str:
    recommendations = {
        'none': 'No se detectaron signos de retinopatia diabetica. Se recomienda control anual de rutina.',
        'mild': 'Se detectaron signos leves de retinopatia diabetica. Consulte con su oftalmologo para evaluacion y seguimiento.',
        'moderate': 'Se detectaron signos moderados de retinopatia diabetica. Se recomienda consulta con oftalmologo a la brevedad.',
        'severe': 'Se detectaron signos severos de retinopatia diabetica. Se requiere atencion oftalmologica urgente.',
        'proliferative': 'Se detecto retinopatia diabetica proliferativa. Se requiere atencion oftalmologica inmediata.',
    }
    return recommendations.get(severity, 'Consulte con un especialista para evaluacion.')

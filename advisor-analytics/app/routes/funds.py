from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.services.fundService import FundService
from app.services.analyticsService import AnalyticsService

router = APIRouter()
fund_service = FundService()
analytics_service = AnalyticsService()

class FundRequest(BaseModel):
    scheme_code: str

class RiskProfileRequest(BaseModel):
    risk_tolerance: str
    investment_horizon: str

@router.get("/schemes")
async def get_schemes(query: Optional[str] = Query(None, description="Search query")):
    try:
        schemes = fund_service.get_schemes(query or "")
        return {"schemes": schemes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/metrics")
async def get_fund_metrics(request: FundRequest):
    try:
        fund_data = fund_service.get_fund_metrics(request.scheme_code)
        metrics = analytics_service.analyze_fund(
            request.scheme_code, 
            fund_data['data']
        )
        return {
            "scheme_name": fund_data['scheme_name'],
            "scheme_code": request.scheme_code,
            **metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze")
async def analyze_fund(request: FundRequest):
    try:
        fund_data = fund_service.get_fund_metrics(request.scheme_code)
        metrics = analytics_service.analyze_fund(
            request.scheme_code,
            fund_data['data']
        )
        
        return {
            "fund_details": {
                "scheme_name": fund_data['scheme_name'],
                "scheme_code": request.scheme_code
            },
            "metrics": metrics,
            "analysis": {
                "risk_level": "Moderate" if metrics['volatility'] < 20 else "High",
                "performance": "Good" if metrics['cagr'] > 12 else "Average",
                "recommendation": "Consider for long-term" if metrics['cagr'] > 15 else "Suitable for moderate risk"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/risk-profile")
async def get_risk_profile(request: RiskProfileRequest):
    try:
        profile = analytics_service.classify_risk_profile(
            request.risk_tolerance,
            request.investment_horizon
        )
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

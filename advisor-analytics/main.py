from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import pandas as pd
import numpy as np
import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Mutual Fund Analytics API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FundRequest(BaseModel):
    scheme_code: str
    period: Optional[str] = "1Y"  # 1Y, 3Y, 5Y

class FundMetrics(BaseModel):
    scheme_name: str
    cagr: float
    volatility: float
    sharpe_ratio: float
    max_drawdown: float
    expense_ratio: Optional[float] = None

@app.get("/")
def read_root():
    return {"message": "Mutual Fund Analytics API", "status": "running"}

@app.get("/schemes/search")
def search_schemes(query: str):
    # Mock data for hackathon
    schemes = [
        {"code": "100027", "name": "SBI Small Cap Fund"},
        {"code": "119551", "name": "HDFC Mid-Cap Opportunities Fund"},
        {"code": "118403", "name": "ICICI Prudential Bluechip Fund"},
        {"code": "120503", "name": "Axis Bluechip Fund"},
        {"code": "119381", "name": "Mirae Asset Large Cap Fund"},
        {"code": "119485", "name": "Parag Parikh Flexi Cap Fund"},
        {"code": "120933", "name": "Kotak Equity Opportunities Fund"},
    ]
    return [s for s in schemes if query.lower() in s['name'].lower()]

@app.post("/funds/metrics")
def get_fund_metrics(request: FundRequest):
    try:
        # Fetch data from mfapi.in
        url = f"https://api.mfapi.in/mf/{request.scheme_code}"
        response = requests.get(url)
        
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Fund not found")
        
        data = response.json()
        
        # Parse NAV data
        df = pd.DataFrame(data['data'])
        df['date'] = pd.to_datetime(df['date'])
        df['nav'] = df['nav'].astype(float)
        df = df.sort_values('date')
        
        # Calculate metrics
        # CAGR
        start_nav = df['nav'].iloc[0]
        end_nav = df['nav'].iloc[-1]
        years = (df['date'].iloc[-1] - df['date'].iloc[0]).days / 365.25
        cagr = (end_nav / start_nav) ** (1/years) - 1
        
        # Volatility
        df['returns'] = df['nav'].pct_change()
        volatility = df['returns'].std() * np.sqrt(252)
        
        # Max Drawdown
        df['cummax'] = df['nav'].cummax()
        df['drawdown'] = (df['nav'] - df['cummax']) / df['cummax']
        max_drawdown = df['drawdown'].min()
        
        # Sharpe Ratio (assuming risk-free rate = 6%)
        risk_free_rate = 0.06
        excess_returns = df['returns'].mean() * 252 - risk_free_rate
        sharpe_ratio = excess_returns / (volatility + 1e-6)
        
        return {
            "scheme_name": data['meta']['scheme_name'],
            "cagr": round(cagr * 100, 2),
            "volatility": round(volatility * 100, 2),
            "sharpe_ratio": round(sharpe_ratio, 2),
            "max_drawdown": round(max_drawdown * 100, 2),
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}

import pandas as pd
import numpy as np
import requests
from datetime import datetime, timedelta
from typing import Dict, Any

class MutualFundAnalyzer:
    def __init__(self):
        self.base_url = "https://api.mfapi.in"
    
    def fetch_nav_data(self, scheme_code: str) -> Dict[str, Any]:
        """Fetch NAV data from mfapi.in"""
        url = f"{self.base_url}/mf/{scheme_code}"
        response = requests.get(url)
        
        if response.status_code != 200:
            raise Exception(f"Failed to fetch data for scheme {scheme_code}")
        
        return response.json()
    
    def calculate_cagr(self, df: pd.DataFrame) -> float:
        """Calculate Compound Annual Growth Rate"""
        start_nav = df['nav'].iloc[0]
        end_nav = df['nav'].iloc[-1]
        years = (df['date'].iloc[-1] - df['date'].iloc[0]).days / 365.25
        return (end_nav / start_nav) ** (1/years) - 1
    
    def calculate_volatility(self, df: pd.DataFrame) -> float:
        """Calculate annualized volatility"""
        df['returns'] = df['nav'].pct_change()
        return df['returns'].std() * np.sqrt(252)
    
    def calculate_max_drawdown(self, df: pd.DataFrame) -> float:
        """Calculate maximum drawdown"""
        df['cummax'] = df['nav'].cummax()
        df['drawdown'] = (df['nav'] - df['cummax']) / df['cummax']
        return df['drawdown'].min()
    
    def calculate_sharpe_ratio(self, df: pd.DataFrame, risk_free_rate: float = 0.06) -> float:
        """Calculate Sharpe ratio"""
        df['returns'] = df['nav'].pct_change()
        excess_returns = df['returns'].mean() * 252 - risk_free_rate
        volatility = df['returns'].std() * np.sqrt(252)
        return excess_returns / (volatility + 1e-6)
    
    def analyze_fund(self, scheme_code: str) -> Dict[str, Any]:
        """Complete fund analysis"""
        data = self.fetch_nav_data(scheme_code)
        
        df = pd.DataFrame(data['data'])
        df['date'] = pd.to_datetime(df['date'])
        df['nav'] = df['nav'].astype(float)
        df = df.sort_values('date')
        
        return {
            'scheme_name': data['meta']['scheme_name'],
            'scheme_code': scheme_code,
            'cagr': round(self.calculate_cagr(df) * 100, 2),
            'volatility': round(self.calculate_volatility(df) * 100, 2),
            'sharpe_ratio': round(self.calculate_sharpe_ratio(df), 2),
            'max_drawdown': round(self.calculate_max_drawdown(df) * 100, 2),
            'data_points': len(df)
        }

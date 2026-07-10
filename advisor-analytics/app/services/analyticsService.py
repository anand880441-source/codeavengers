import pandas as pd
import numpy as np
from typing import Dict, Any

class AnalyticsService:
    def __init__(self):
        self.risk_free_rate = 0.06
    
    def calculate_cagr(self, df: pd.DataFrame) -> float:
        start_nav = df['nav'].iloc[0]
        end_nav = df['nav'].iloc[-1]
        years = (df['date'].iloc[-1] - df['date'].iloc[0]).days / 365.25
        return (end_nav / start_nav) ** (1/years) - 1
    
    def calculate_volatility(self, df: pd.DataFrame) -> float:
        df['returns'] = df['nav'].pct_change()
        return df['returns'].std() * np.sqrt(252)
    
    def calculate_max_drawdown(self, df: pd.DataFrame) -> float:
        df['cummax'] = df['nav'].cummax()
        df['drawdown'] = (df['nav'] - df['cummax']) / df['cummax']
        return df['drawdown'].min()
    
    def calculate_sharpe_ratio(self, df: pd.DataFrame) -> float:
        df['returns'] = df['nav'].pct_change()
        excess_returns = df['returns'].mean() * 252 - self.risk_free_rate
        volatility = df['returns'].std() * np.sqrt(252)
        return excess_returns / (volatility + 1e-6)
    
    def analyze_fund(self, scheme_code: str, fund_data: pd.DataFrame) -> Dict[str, Any]:
        df = fund_data.copy()
        
        return {
            'scheme_code': scheme_code,
            'cagr': round(self.calculate_cagr(df) * 100, 2),
            'volatility': round(self.calculate_volatility(df) * 100, 2),
            'sharpe_ratio': round(self.calculate_sharpe_ratio(df), 2),
            'max_drawdown': round(self.calculate_max_drawdown(df) * 100, 2),
            'data_points': len(df)
        }
    
    def classify_risk_profile(self, risk_tolerance: str, horizon: str) -> Dict[str, Any]:
        risk_mapping = {
            'low': {'category': 'Conservative', 'equity': 30, 'debt': 70},
            'medium': {'category': 'Moderate', 'equity': 60, 'debt': 40},
            'high': {'category': 'Aggressive', 'equity': 85, 'debt': 15}
        }
        
        horizon_mapping = {
            'short': {'years': 3, 'suggestion': 'Debt-heavy portfolio'},
            'medium': {'years': 5, 'suggestion': 'Balanced portfolio'},
            'long': {'years': 10, 'suggestion': 'Equity-heavy portfolio'}
        }
        
        risk = risk_mapping.get(risk_tolerance, risk_mapping['medium'])
        horizon_info = horizon_mapping.get(horizon, horizon_mapping['medium'])
        
        return {
            'risk_category': risk['category'],
            'equity_allocation': risk['equity'],
            'debt_allocation': risk['debt'],
            'suggested_horizon': horizon_info['years'],
            'suggestion': horizon_info['suggestion']
        }

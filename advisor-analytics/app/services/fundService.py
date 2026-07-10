import requests
import pandas as pd
from typing import Dict, Any, List

class FundService:
    def __init__(self):
        self.base_url = "https://api.mfapi.in"
    
    def fetch_fund_data(self, scheme_code: str) -> Dict[str, Any]:
        url = f"{self.base_url}/mf/{scheme_code}"
        response = requests.get(url)
        
        if response.status_code != 200:
            raise Exception(f"Failed to fetch data for scheme {scheme_code}")
        
        return response.json()
    
    def get_schemes(self, query: str = "") -> List[Dict[str, str]]:
        schemes = [
            {"code": "100027", "name": "SBI Small Cap Fund"},
            {"code": "119551", "name": "HDFC Mid-Cap Opportunities Fund"},
            {"code": "118403", "name": "ICICI Prudential Bluechip Fund"},
            {"code": "120503", "name": "Axis Bluechip Fund"},
            {"code": "119381", "name": "Mirae Asset Large Cap Fund"},
            {"code": "119485", "name": "Parag Parikh Flexi Cap Fund"},
            {"code": "120933", "name": "Kotak Equity Opportunities Fund"},
        ]
        
        if query:
            return [s for s in schemes if query.lower() in s['name'].lower()]
        return schemes
    
    def get_fund_metrics(self, scheme_code: str) -> Dict[str, Any]:
        data = self.fetch_fund_data(scheme_code)
        
        df = pd.DataFrame(data['data'])
        df['date'] = pd.to_datetime(df['date'])
        df['nav'] = df['nav'].astype(float)
        df = df.sort_values('date')
        
        return {
            'scheme_name': data['meta']['scheme_name'],
            'scheme_code': scheme_code,
            'data': df
        }

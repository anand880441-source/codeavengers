from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="Mutual Fund Analytics API",
    description="Analytics service for mutual fund data",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {
        "service": "Mutual Fund Analytics API",
        "status": "running",
        "version": "1.0.0"
    }

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Import and include routes
from app.routes import funds, analytics
app.include_router(funds.router, prefix="/api/funds", tags=["funds"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

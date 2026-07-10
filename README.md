# AI Voice-Driven Mutual Fund Advisor

A voice-first AI assistant that helps beginners understand mutual funds through natural conversation and generates personalized reports based on real historical data.

## 🚀 Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Web Speech API (Voice I/O)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Ollama (Gemma 3 LLM)

### Analytics
- Python + FastAPI
- pandas + numpy
- mfapi.in (Mutual Fund Data)

## 📁 Project Structure

 + "" + "" + "" + 
advisor-project/
├── advisor-frontend/      # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── package.json
├── advisor-backend/       # Node.js + Express
│   ├── models/
│   ├── routes/
│   └── services/
├── advisor-analytics/     # Python + FastAPI
│   ├── main.py
│   └── analytics.py
└── docs/                 # Documentation
 + "" + "" + "" + 

## 🔧 Setup

1. Install dependencies:
    + "" + "" + "" + 
   .\setup.ps1
    + "" + "" + "" + 

2. Start all services:
    + "" + "" + "" + 
   .\start-all.ps1
    + "" + "" + "" + 

3. Access the app:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Analytics: http://localhost:8000

## 📋 Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- MongoDB (local or Atlas)
- Ollama (for local LLM)

## 🎯 Features

- ✅ Voice-based conversation
- ✅ Adaptive questions based on user responses
- ✅ Real mutual fund data from mfapi.in
- ✅ Personalized investment reports
- ✅ Risk profiling based on conversation
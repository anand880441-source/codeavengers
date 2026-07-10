import React, { useState, useEffect } from 'react';
import Disclaimer from './components/Disclaimer';
import ChatInterface from './components/ChatInterface';
import ReportDisplay from './components/ReportDisplay';
import { createConversation, generateReport, checkComplete } from './services/api';
import './App.css';

function App() {
  const [conversationId, setConversationId] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [error, setError] = useState(null);

  const startConversation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const conv = await createConversation();
      setConversationId(conv._id);
      setIsComplete(false);
      setReport(null);
      setShowReport(false);
    } catch (err) {
      setError('Failed to start a new session. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!conversationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateReport(conversationId);
      setReport(result);
      setShowReport(true);
    } catch (err) {
      setError('Failed to generate your report. Please check your connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startConversation();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        
        {/* Elegant Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-xs font-semibold mb-3">
            <span>✨ AI-Powered Wealth Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
            AI Mutual Fund Advisor
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base max-w-md mx-auto">
            Voice-driven investment guidance designed to make financial growth simple for beginners.
          </p>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* Main Content Area */}
        <main className="space-y-6">
          {showReport && report ? (
            <ReportDisplay 
              report={report} 
              onNewChat={startConversation} 
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden transition-all duration-300">
              
              {/* Dynamic Header Block */}
              <div className={`p-5 border-b border-slate-100 flex items-center justify-between ${isComplete ? 'bg-emerald-50/40' : 'bg-slate-50/50'}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${isComplete ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`} />
                  <h2 className="font-semibold text-slate-700 text-sm md:text-base">
                    {isComplete ? 'Conversation Analysis Ready' : 'Live Consultation Session'}
                  </h2>
                </div>
                
                <button 
                  onClick={startConversation}
                  disabled={isLoading}
                  className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  🔄 Reset Session
                </button>
              </div>

              {/* Chat Interface Container */}
              <div className="p-6">
                <ChatInterface 
                  conversationId={conversationId} 
                  onMessageSent={() => {}} 
                  onComplete={() => setIsComplete(true)} 
                />

                {/* Sticky Action Footer when complete */}
                {isComplete && (
                  <div className="mt-6 pt-6 border-t border-slate-100 bg-gradient-to-b from-white to-slate-50/50 rounded-b-2xl">
                    <button 
                      onClick={handleGenerateReport} 
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl shadow-lg shadow-indigo-600/20 font-medium transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>⏳ Mapping Portfolio Algorithms...</>
                      ) : (
                        <>📊 Generate Personal Investment Report</>
                      )}
                    </button>
                    <p className="text-xs text-slate-400 mt-3 text-center px-4">
                      Compiling tailored index allocations and risk parameters based on your conversation profiles.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Disclaimer at Bottom */}
          <Disclaimer />
        </main>
      </div>
    </div>
  );
}

export default App;

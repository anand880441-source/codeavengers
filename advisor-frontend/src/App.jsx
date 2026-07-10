import React, { useState, useEffect, useRef } from 'react';
import Disclaimer from './components/Disclaimer';
import { createConversation, sendMessage, generateReport, checkComplete } from './services/api';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [report, setReport] = useState(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = async () => {
    try {
      const conv = await createConversation();
      setConversationId(conv._id);
      setMessages([]);
      setIsComplete(false);
      setReport(null);
      
      setMessages([{
        role: 'assistant',
        content: 'Hello! I\'m your AI Mutual Fund Advisor. 🎯\n\nI\'m here to help you understand mutual funds and create a personalized investment plan. To get started, tell me about your investment goals. Are you saving for retirement, education, or wealth creation?'
      }]);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isComplete) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let currentId = conversationId;
      if (!currentId) {
        const conv = await createConversation();
        currentId = conv._id;
        setConversationId(currentId);
      }

      const response = await sendMessage(currentId, userMessage);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);

      const status = await checkComplete(currentId);
      if (status.isComplete) {
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleGenerateReport = async () => {
    if (!conversationId) return;
    
    setIsLoading(true);
    try {
      const result = await generateReport(conversationId);
      setReport(result);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startConversation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            🎯 AI Mutual Fund Advisor
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Voice-driven investment guidance for beginners
          </p>
        </header>

        <Disclaimer />

        {!report ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-32">
                  <p className="text-lg">💬 Start your investment journey</p>
                  <p className="text-sm mt-2">Tell me about your investment goals</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={"mb-3 flex " + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={"max-w-xs lg:max-w-md px-4 py-2 rounded-lg whitespace-pre-wrap " + (msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800')}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                    <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-pulse mx-0.5"></span>
                    <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-pulse mx-0.5" style={{ animationDelay: '0.2s' }}></span>
                    <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-pulse mx-0.5" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || isComplete}
              />
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={isLoading || isComplete || !input.trim()}
              >
                Send
              </button>
            </div>

            {isComplete && (
              <div className="mt-4">
                <button
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                  className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Generating...' : '📊 Generate Report'}
                </button>
              </div>
            )}

            <button
              onClick={startConversation}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              🔄 Start New Conversation
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Your Investment Report</h2>
            
            <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <p className="text-xs text-yellow-800">
                ⚠️ <span className="font-semibold">Disclaimer:</span> {report.disclaimer}
              </p>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">{report.summary}</div>
            </div>

            {report.recommendations && report.recommendations.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommended Funds</h3>
                <div className="grid gap-3">
                  {report.recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">{rec.schemeName}</h4>
                          <p className="text-sm text-gray-600">Allocation: {rec.allocation}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm"><span className="font-medium">CAGR:</span> {rec.cagr}%</p>
                          <p className="text-sm"><span className="font-medium">Volatility:</span> {rec.volatility}%</p>
                        </div>
                      </div>
                      {rec.reason && (
                        <p className="text-sm text-gray-600 mt-2">{rec.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setReport(null);
                startConversation();
              }}
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Start New Conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

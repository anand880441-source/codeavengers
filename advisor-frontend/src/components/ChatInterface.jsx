import React, { useState, useEffect, useRef } from 'react';
import VoiceButton from './VoiceButton';
import LoadingSpinner from './LoadingSpinner';
import { sendMessage } from '../services/api';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

const ChatInterface = ({ conversationId, onMessageSent, onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef(null);

  const { speakAuto, isSpeaking, cancel } = useSpeechSynthesis({
    autoSpeak: autoSpeak,
    rate: 1,
    pitch: 1,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // FIX: Removed the stale setTimeout closure hazard. 
  // It instantly submits the transcript securely.
  const handleVoiceTranscript = (transcript) => {
    if (transcript && transcript.trim()) {
      const cleanTranscript = transcript.trim();
      setInput(cleanTranscript);
      handleSend(cleanTranscript);
    }
  };

  const handleSend = async (messageContent = null) => {
    const textToSend = messageContent || input;
    if (!textToSend || !textToSend.trim() || isLoading) return;

    setInput('');
    setIsLoading(true);

    const userMessage = { role: 'user', content: textToSend.trim() };
    setMessages(prev => [...prev, userMessage]);

    try {
      if (onMessageSent) onMessageSent();

      const response = await sendMessage(conversationId, textToSend.trim());

      const aiMessage = { role: 'assistant', content: response.message };
      setMessages(prev => [...prev, aiMessage]);

      if (autoSpeak) {
        speakAuto(response.message);
      }

      if (response.conversation?.completed || response.completed) {
        if (onComplete) onComplete();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I encountered an operational error connection. Please try submitting that phrase again.'
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

  const toggleAutoSpeak = () => {
    setAutoSpeak(!autoSpeak);
    if (isSpeaking) {
      cancel();
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Premium Chat Messages Body */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-slate-50/60 rounded-xl border border-slate-100/80 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 text-xl">
              🎯
            </div>
            <h3 className="font-semibold text-slate-700 text-sm md:text-base">Start Your Portfolio Discovery</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
              Click the microphone button to talk naturally or type out your short-term financial targets.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
              <LoadingSpinner />
              <span className="text-xs text-slate-400 font-medium animate-pulse">Analyzing portfolio options...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Control Action Dock */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-white p-1.5 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
          
          {/* Enhanced Voice Mic Button Hook */}
          <VoiceButton
            onTranscript={handleVoiceTranscript}
            isListening={isListening}
            setIsListening={setIsListening}
          />

          {/* Core Text Input Field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? '🎙️ Listening closely...' : 'Ask about risk, index funds, timelines...'}
            className="flex-1 px-2 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent disabled:opacity-60"
            disabled={isLoading || isListening}
          />

          {/* Sound/Speaker Status Toggle */}
          <button
            onClick={toggleAutoSpeak}
            type="button"
            className={`p-2 rounded-lg text-xs font-semibold transition-all ${
              autoSpeak 
                ? 'bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100' 
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
            title={autoSpeak ? 'Mute Assistant Voice' : 'Unmute Assistant Voice'}
          >
            {autoSpeak ? '🔊 Voice On' : '🔇 Muted'}
          </button>

          {/* Submit Action Control */}
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim() || isListening}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 active:bg-slate-950 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            Send
          </button>
        </div>

        {/* Live Audio Feedback Strips */}
        {isListening && (
          <div className="flex items-center justify-center gap-1.5 py-1 text-xs text-rose-500 font-medium bg-rose-50/50 border border-rose-100/50 rounded-lg animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
            Microphone active. Say your response cleanly...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;

import { useState, useEffect, useCallback, useRef } from 'react';

const useSpeechSynthesis = ({ 
  language = 'en-US', 
  rate = 1, 
  pitch = 1, 
  volume = 1,
  autoSpeak = false
} = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const utteranceRef = useRef(null);
  const queueRef = useRef([]);

  // Check browser support
  useEffect(() => {
    if (!window.speechSynthesis) {
      setIsSupported(false);
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Find a voice matching the language
      const voice = availableVoices.find(v => v.lang.startsWith(language.split('-')[0])) || availableVoices[0];
      setSelectedVoice(voice || null);
    };

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, [language]);

  // Speak text
  const speak = useCallback((text) => {
    if (!isSupported || !text || text.trim() === '') {
      return;
    }

    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (queueRef.current.length > 0) {
        const nextText = queueRef.current.shift();
        speak(nextText);
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, language, rate, pitch, volume, selectedVoice]);

  // Cancel speech
  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      queueRef.current = [];
    }
  }, []);

  // Pause speech
  const pause = useCallback(() => {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }, []);

  // Resume speech
  const resume = useCallback(() => {
    if (window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, []);

  // Queue text to speak after current
  const queue = useCallback((text) => {
    queueRef.current.push(text);
  }, []);

  // Speak with auto-speak enabled (for AI responses)
  const speakAuto = useCallback((text, shouldSpeak = autoSpeak) => {
    if (shouldSpeak) {
      speak(text);
    }
  }, [autoSpeak, speak]);

  // Toggle speech on/off
  const toggleSpeech = useCallback(() => {
    if (isSpeaking) {
      cancel();
    } else {
      // Resume if paused, or just restart
      if (window.speechSynthesis && window.speechSynthesis.paused) {
        resume();
      }
    }
  }, [isSpeaking, cancel, resume]);

  return {
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    speak,
    speakAuto,
    cancel,
    pause,
    resume,
    queue,
    toggleSpeech,
    setSelectedVoice,
  };
};

export default useSpeechSynthesis;

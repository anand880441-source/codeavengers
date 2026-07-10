import React from 'react';

const VoiceButton = ({ onTranscript, isListening, setIsListening }) => {
  const [recognition, setRecognition] = React.useState(null);
  const [isSupported, setIsSupported] = React.useState(true);

  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'en-US';
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;

    recognitionInstance.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript = event.results[i][0].transcript;
        }
      }
      if (transcript) {
        if (onTranscript) onTranscript(transcript);
        if (setIsListening) setIsListening(false);
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access.');
      }
      if (setIsListening) setIsListening(false);
    };

    recognitionInstance.onend = () => {
      if (setIsListening) setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) recognitionInstance.abort();
    };
  }, []);

  const toggleRecording = () => {
    if (!recognition || !isSupported) {
      alert('Voice input not supported. Please use Chrome.');
      return;
    }

    if (isListening) {
      recognition.stop();
      if (setIsListening) setIsListening(false);
    } else {
      recognition.start();
      if (setIsListening) setIsListening(true);
    }
  };

  if (!isSupported) {
    return (
      <button className="px-3 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-50 text-sm">
        🎤 Unavailable
      </button>
    );
  }

  return (
    <button
      onClick={toggleRecording}
      className={
        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ' +
        (isListening 
          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' 
          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg')
      }
      title={isListening ? 'Stop recording' : 'Start voice input'}
    >
      <span className="text-base">{isListening ? '⏹' : '🎤'}</span>
      <span>{isListening ? 'Listening...' : 'Voice'}</span>
    </button>
  );
};

export default VoiceButton;

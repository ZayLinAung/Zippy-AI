import React, { useState, useEffect, useRef } from 'react';
import { getGeminiResponse } from '../services/geminiService';

function VoiceChat() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startTalking = () => {
    setTranscript('');
    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopTalking = () => {
    recognitionRef.current.stop();
    setIsListening(false);
    handleSend();
  };

  const handleSend = async () => {
    if (transcript) {
      setIsLoading(true);
      try {
        const aiResponse = await getGeminiResponse(transcript, chatHistory, 'voice');
        setChatHistory(prev => [...prev, { user: 'You', text: transcript }, { user: 'AI', text: aiResponse }]);
        speakResponse(aiResponse);
      } catch (error) {
        console.error("Error getting AI response:", error);
        speakResponse("I'm sorry, I encountered an error. Please try again.");
      } finally {
        setIsLoading(false);
        setTranscript('');
      }
    }
  };

  const speakResponse = (text) => {
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.onstart = () => setIsSpeaking(true);
    utteranceRef.current.onend = () => setIsSpeaking(false);
    utteranceRef.current.voice = synthRef.current.getVoices().find(voice => voice.name.includes('Female'));
    synthRef.current.speak(utteranceRef.current);
  };

  const interruptSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Talk to AI Coach</h2>
      <div className="space-y-4">
        <button
          className={`w-full py-3 px-6 rounded-full font-bold text-white transition-colors ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={isListening ? stopTalking : startTalking}
          disabled={isSpeaking || isLoading}
        >
          {isListening ? 'Stop Talking' : 'Start Talking'}
        </button>
        {transcript && <p className="text-gray-700">You said: {transcript}</p>}
        {isSpeaking && (
          <button
            className="w-full py-3 px-6 rounded-full font-bold text-white bg-yellow-500 hover:bg-yellow-600 transition-colors"
            onClick={interruptSpeech}
          >
            Interrupt
          </button>
        )}
        {isLoading && <p className="text-center text-gray-600">Thinking...</p>}
      </div>
      <div className="mt-8 space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`p-3 rounded-lg ${msg.user === 'You' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
            <span className="font-bold">{msg.user}: </span>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VoiceChat;

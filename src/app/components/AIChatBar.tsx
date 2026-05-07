import { useState, useRef } from 'react';
import { Send, Loader2, Mic, MicOff } from 'lucide-react';
import { parseTransaction } from '../../lib/groq';
import profilePic from '../../imports/Profile.png';

interface AIChatBarProps {
  onParsed: (data: {
    amount: number;
    description: string;
    wallet: string;
    type: 'expense' | 'income';
    category: string;
    categoryEmoji: string;
  }) => void;
}

export function AIChatBar({ onParsed }: AIChatBarProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Auto-submit after voice input
      processMessage(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const processMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await parseTransaction(message);
      onParsed(result);
      setInput('');
    } catch (error) {
      console.error("Failed to parse transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    processMessage(input);
  };

  return (
    <div className={`bg-white border-4 rounded-lg p-3 shadow-[4px_4px_0_0_#6D4C41] transition-all ${isListening ? 'border-[#D32F2F] ring-2 ring-[#D32F2F]/20' : 'border-[#8D6E63] focus-within:border-[#D2691E]'}`}>
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="shrink-0 w-8 h-8 bg-[#FFB6C1] border-2 border-[#3E2723] rounded-lg overflow-hidden flex items-center justify-center">
          <img src={profilePic} alt="Profile" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
        </div>
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`transition-all ${isListening ? 'text-[#D32F2F] animate-pulse' : 'text-[#8D6E63] hover:text-[#D2691E]'}`}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening..." : isLoading ? "Thinking..." : "Tell me what you spent..."}
          disabled={isLoading}
          className="flex-1 bg-transparent text-sm text-[#3E2723] placeholder-[#8D6E63] outline-none disabled:opacity-50"
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading || isListening}
          className="text-[#8D6E63] hover:text-[#D2691E] disabled:opacity-30 transition-colors"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
}

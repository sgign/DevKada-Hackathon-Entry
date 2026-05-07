import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { parseTransaction } from '../../lib/groq';

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await parseTransaction(input);
      onParsed(result);
      setInput('');
    } catch (error) {
      console.error("Failed to parse transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-4 border-[#8D6E63] rounded-lg p-3 shadow-[4px_4px_0_0_#6D4C41] focus-within:border-[#D2691E] transition-colors">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Thinking..." : "Tell me what you spent..."}
          disabled={isLoading}
          className="flex-1 bg-transparent text-sm text-[#3E2723] placeholder-[#8D6E63] outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
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

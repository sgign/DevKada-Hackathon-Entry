import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Brain } from 'lucide-react';
import { getSpendingAdvice } from '../../lib/groq';

interface AISpendingAdviceProps {
  transactions: any[];
}

export function AISpendingAdvice({ transactions }: AISpendingAdviceProps) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdvice = async () => {
    if (transactions.length === 0) return;
    setIsLoading(true);
    try {
      const result = await getSpendingAdvice(transactions);
      setAdvice(result);
    } catch (error) {
      console.error("Failed to get AI advice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (transactions.length > 0 && !advice) {
      fetchAdvice();
    }
  }, [transactions]);

  return (
    <div className="bg-white border-4 border-[#3E2723] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41]">
      <div className="bg-[#CE93D8] px-4 py-2 border-b-4 border-[#8D6E63] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-[#3E2723]" />
          <h3 className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">AI SPENDING COACH</h3>
        </div>
        <button 
          onClick={fetchAdvice}
          disabled={isLoading}
          className="text-[#3E2723] hover:text-white transition-colors disabled:opacity-50"
        >
          <Sparkles size={16} />
        </button>
      </div>
      
      <div className="p-4 bg-[#FFF9E6]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <Loader2 size={32} className="animate-spin text-[#8D6E63]" />
            <p className="font-['Press_Start_2P'] text-[8px] text-[#8D6E63] animate-pulse text-center">
              ANALYZING YOUR HABITS...
            </p>
          </div>
        ) : advice ? (
          <div className="prose prose-sm max-w-none">
            <div className="text-[10px] text-[#3E2723] leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
              {advice}
            </div>
            <div className="mt-4 pt-3 border-t-2 border-[#8D6E63]/20 text-center">
              <span className="text-2xl">🐷💼</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="font-['Press_Start_2P'] text-[8px] text-[#8D6E63]">
              LOG SOME TRANSACTIONS TO GET AI ADVICE!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

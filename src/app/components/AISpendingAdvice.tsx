import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Brain } from 'lucide-react';
import { getSpendingAdvice } from '../../lib/groq';
import profilePic from '../../imports/Profile.png';

interface AISpendingAdviceProps {
  transactions: any[];
  budgetInfo: any;
  goalsInfo: any;
}

export function AISpendingAdvice({ transactions, budgetInfo, goalsInfo }: AISpendingAdviceProps) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdvice = async () => {
    if (transactions.length === 0) return;
    setIsLoading(true);
    try {
      const result = await getSpendingAdvice(transactions, budgetInfo, goalsInfo);
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
          <h3 className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">CHICHA'S FINANCIAL ADVICE</h3>
        </div>
        <button 
          onClick={fetchAdvice}
          disabled={isLoading}
          className="text-[#3E2723] hover:text-white transition-colors disabled:opacity-50"
        >
          <Sparkles size={16} />
        </button>
      </div>
      
      <div className="p-4 bg-[#FFF9E6] space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <Loader2 size={32} className="animate-spin text-[#8D6E63]" />
            <p className="font-['Press_Start_2P'] text-[8px] text-[#8D6E63] animate-pulse text-center">
              ANALYZING YOUR HABITS...
            </p>
          </div>
        ) : advice ? (
          <div className="flex items-start gap-3">
            {/* Chicha Avatar */}
            <div className="shrink-0 w-10 h-10 bg-[#FFB6C1] border-2 border-[#3E2723] rounded-lg overflow-hidden flex items-center justify-center shadow-[2px_2px_0_0_#3E2723]">
              <img src={profilePic} alt="Chicha" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
            </div>

            {/* Chat Bubble */}
            <div className="relative flex-1 bg-white border-3 border-[#8D6E63] rounded-2xl rounded-tl-none p-3 shadow-[2px_2px_0_0_#8D6E63]">
              {/* Bubble Tail */}
              <div className="absolute top-[-3px] left-[-10px] w-0 h-0 border-t-[10px] border-t-transparent border-r-[10px] border-r-[#8D6E63] border-b-[10px] border-b-transparent hidden md:block" />
              
              <div className="prose prose-sm max-w-none">
                <div className="text-[11px] text-[#3E2723] leading-relaxed whitespace-pre-wrap font-sans">
                  {advice.split('\n').map((line, i) => {
                    const cleanLine = line.replace(/[#*]/g, '').trim();
                    if (!cleanLine) return null;

                    if (line.startsWith('#') || line.match(/^\d\./)) {
                      return <p key={i} className="font-['Press_Start_2P'] text-[7px] text-[#D2691E] mt-2 mb-1">{cleanLine}</p>;
                    }
                    return <p key={i} className="mb-1">{cleanLine}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="font-['Press_Start_2P'] text-[8px] text-[#8D6E63]">
              LOG SOME TRANSACTIONS TO GET ADVICE FROM CHICHA!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

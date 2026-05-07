import { PlusCircle, Camera } from 'lucide-react';

interface QuickActionsProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
  onScanReceipt: () => void;
}

export function QuickActions({ onAddExpense, onAddIncome, onScanReceipt }: QuickActionsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onAddExpense}
          className="bg-[#FFB6C1] hover:bg-[#FFB6C1]/80 border-4 border-[#8D6E63] rounded-lg p-4 transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41]"
        >
          <div className="flex flex-col items-center gap-2">
            <PlusCircle size={32} className="text-[#3E2723]" />
            <span className="font-['Press_Start_2P'] text-[8px] text-[#3E2723]">LOG EXPENSE</span>
          </div>
        </button>

        <button
          onClick={onAddIncome}
          className="bg-[#81C784] hover:bg-[#81C784]/80 border-4 border-[#8D6E63] rounded-lg p-4 transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41]"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl leading-none">💵</span>
            <span className="font-['Press_Start_2P'] text-[8px] text-[#3E2723]">LOG INCOME</span>
          </div>
        </button>
      </div>

      <button
        onClick={onScanReceipt}
        className="w-full bg-[#A8D5BA] hover:bg-[#A8D5BA]/80 border-4 border-[#8D6E63] rounded-lg p-4 transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41]"
      >
        <div className="flex flex-col items-center gap-2">
          <Camera size={32} className="text-[#3E2723]" />
          <span className="font-['Press_Start_2P'] text-[8px] text-[#3E2723]">SCAN RECEIPT</span>
        </div>
      </button>
    </div>
  );
}

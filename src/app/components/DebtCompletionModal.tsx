import { X } from 'lucide-react';

interface DebtCompletionModalProps {
  debtName: string;
  debtEmoji: string;
  totalAmount: number;
  onClose: () => void;
  onRemove: () => void;
}

export function DebtCompletionModal({ debtName, debtEmoji, totalAmount, onClose, onRemove }: DebtCompletionModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#F5DEB3] border-4 border-[#8D6E63] rounded-2xl shadow-[8px_8px_0_0_#6D4C41] animate-bounce-once">
        {/* Header */}
        <div className="bg-[#81C784] px-6 py-4 border-b-4 border-[#8D6E63] rounded-t-xl flex items-center justify-between">
          <h2 className="font-['Press_Start_2P'] text-xs text-[#3E2723]">
            DEBT PAID! 🎉
          </h2>
          <button
            onClick={onClose}
            className="text-[#3E2723] hover:text-[#D2691E] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          {/* Emoji and Celebration */}
          <div className="text-6xl animate-pulse">
            {debtEmoji}
          </div>

          <div className="space-y-2">
            <p className="font-['Press_Start_2P'] text-sm text-[#81C784]">
              CONGRATULATIONS!
            </p>
            <p className="text-sm text-[#3E2723]">
              You've fully paid off
            </p>
            <p className="font-['Press_Start_2P'] text-[10px] text-[#D2691E]">
              {debtName}
            </p>
            <p className="text-sm text-[#6D4C41] mt-3">
              Total paid: ₱{totalAmount.toLocaleString()}
            </p>
          </div>

          {/* Pig Celebration */}
          <div className="text-4xl">
            🐷✨
          </div>

          <p className="text-[10px] text-[#6D4C41] px-4">
            Your pig is proud of you! Would you like to remove this debt from your tracker?
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-white hover:bg-[#FFF9E6] border-4 border-[#8D6E63] rounded-lg py-3 font-['Press_Start_2P'] text-[9px] text-[#3E2723] shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              KEEP IT
            </button>
            <button
              onClick={onRemove}
              className="flex-1 bg-[#81C784] hover:bg-[#81C784]/80 border-4 border-[#8D6E63] rounded-lg py-3 font-['Press_Start_2P'] text-[9px] text-[#3E2723] shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              REMOVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

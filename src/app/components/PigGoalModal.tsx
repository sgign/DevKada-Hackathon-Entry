import { X } from 'lucide-react';

interface PigGoalModalProps {
  pigNumber: number;
  goal: {
    name: string;
    emoji: string;
    targetAmount: number;
    savedAmount: number;
    deadline: string;
  };
  onClose: () => void;
}

export function PigGoalModal({ pigNumber, goal, onClose }: PigGoalModalProps) {
  const percentage = (goal.savedAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.savedAmount;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#F5DEB3] border-4 border-[#8D6E63] rounded-2xl shadow-[8px_8px_0_0_#6D4C41]">
        {/* Header */}
        <div className="bg-[#FFB6C1] px-6 py-4 border-b-4 border-[#8D6E63] rounded-t-xl flex items-center justify-between">
          <h2 className="font-['Press_Start_2P'] text-xs text-[#3E2723]">
            PIG #{pigNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-[#3E2723] hover:text-[#D2691E] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Pig Avatar */}
          <div className="text-center">
            <div className="text-6xl mb-2">🐷</div>
            <p className="font-['Press_Start_2P'] text-[10px] text-[#6D4C41]">
              This pig represents
            </p>
          </div>

          {/* Goal Info */}
          <div className="bg-white border-4 border-[#8D6E63] rounded-lg p-4 shadow-[4px_4px_0_0_#6D4C41] space-y-3">
            <div className="text-center">
              <div className="text-4xl mb-2">{goal.emoji}</div>
              <h3 className="font-['Press_Start_2P'] text-sm text-[#3E2723] mb-2">
                {goal.name}
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-[#6D4C41]">Target:</span>
                <span className="font-['Press_Start_2P'] text-[10px] text-[#3E2723]">
                  ₱{goal.targetAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-[#6D4C41]">Saved:</span>
                <span className="font-['Press_Start_2P'] text-[10px] text-[#81C784]">
                  ₱{goal.savedAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-[#6D4C41]">Remaining:</span>
                <span className="font-['Press_Start_2P'] text-[10px] text-[#D2691E]">
                  ₱{remaining.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-[#6D4C41]">Deadline:</span>
                <span className="font-['Press_Start_2P'] text-[10px] text-[#3E2723]">
                  {goal.deadline}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="h-4 bg-[#E8D5B7] rounded border-2 border-[#8D6E63] overflow-hidden">
                <div
                  className="h-full bg-[#81C784] transition-all"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className="text-[8px] text-[#6D4C41] mt-1 text-right">
                {percentage.toFixed(0)}% complete
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-[#A8D5BA] hover:bg-[#A8D5BA]/80 border-4 border-[#8D6E63] rounded-lg py-3 font-['Press_Start_2P'] text-[10px] text-[#3E2723] shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddPigGoalModalProps {
  onClose: () => void;
  onSubmit: (goalData: {
    name: string;
    targetAmount: number;
    emoji: string;
    deadline: string;
  }) => void;
}

const EMOJI_OPTIONS = ['🐷', '📱', '✈️', '💰', '🚗', '🏠', '🏖️', '🏥', '📚', '🏪', '📺', '💍', '🎒', '🎵', '🎮', '🎉', '⛺'];

export function AddPigGoalModal({ onClose, onSubmit }: AddPigGoalModalProps) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [emoji, setEmoji] = useState('🐷');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      targetAmount: parseFloat(targetAmount) || 0,
      emoji: emoji || '🐷',
      deadline
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#F5DEB3] border-t-4 border-[#8D6E63] rounded-t-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-[#FFB6C1] px-6 py-4 border-b-4 border-[#8D6E63] flex items-center justify-between shadow-[0_4px_0_0_#6D4C41] z-10">
          <h2 className="font-['Press_Start_2P'] text-xs text-[#3E2723]">
            ADD NEW GOAL
          </h2>
          <button
            onClick={onClose}
            className="text-[#3E2723] hover:text-[#D2691E] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Goal Name */}
          <div>
            <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
              GOAL NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Vacation"
              className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-4 py-3 text-[#3E2723] placeholder-[#BCAAA4] focus:outline-none focus:border-[#D2691E] shadow-[4px_4px_0_0_#6D4C41]"
              autoFocus
              required
            />
          </div>

          {/* Goal Amount */}
          <div>
            <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
              TARGET AMOUNT
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-[#6D4C41]">
                ₱
              </span>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white border-4 border-[#8D6E63] rounded-lg pl-12 pr-4 py-4 text-2xl text-[#3E2723] placeholder-[#BCAAA4] focus:outline-none focus:border-[#D2691E] shadow-[4px_4px_0_0_#6D4C41]"
                required
              />
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
              TARGET DATE
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-4 py-3 text-[#3E2723] focus:outline-none focus:border-[#D2691E] shadow-[4px_4px_0_0_#6D4C41]"
              required
            />
          </div>

          {/* Emoji Selection */}
          <div>
            <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
              EMOJI (OPTIONAL)
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setEmoji(opt)}
                  className={`p-2 rounded-lg border-3 transition-all shadow-[2px_2px_0_0_#6D4C41] ${
                    emoji === opt
                      ? 'bg-[#A8D5BA] border-[#2E7D32] scale-105'
                      : 'bg-white border-[#8D6E63] hover:border-[#D2691E]'
                  }`}
                >
                  <div className="text-xl">{opt}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name || !targetAmount || !deadline}
            className={`w-full bg-[#FFD966] hover:bg-[#FFD966]/80 disabled:bg-[#BCAAA4] disabled:cursor-not-allowed border-4 border-[#8D6E63] rounded-lg py-4 font-['Press_Start_2P'] text-xs text-[#3E2723] transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41]`}
          >
            ADD PIG GOAL
          </button>
        </form>
      </div>
    </div>
  );
}

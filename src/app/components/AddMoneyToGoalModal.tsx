import { useState } from 'react';
import { X } from 'lucide-react';

interface AddMoneyToGoalModalProps {
  goalName: string;
  wallets: string[];
  onClose: () => void;
  onSubmit: (data: { amount: number; wallet: string }) => void;
}

export function AddMoneyToGoalModal({ goalName, wallets, onClose, onSubmit }: AddMoneyToGoalModalProps) {
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState(wallets[0] || 'Cash');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;
    
    onSubmit({
      amount: parseFloat(amount),
      wallet
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#F5DEB3] border-4 border-[#8D6E63] rounded-2xl shadow-[8px_8px_0_0_#6D4C41]">
        {/* Header */}
        <div className="bg-[#A8D5BA] px-6 py-4 border-b-4 border-[#8D6E63] rounded-t-xl flex items-center justify-between">
          <h2 className="font-['Press_Start_2P'] text-[10px] text-[#3E2723]">
            FEED PIG: {goalName}
          </h2>
          <button
            onClick={onClose}
            className="text-[#3E2723] hover:text-[#D2691E] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
              AMOUNT TO ADD
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-[#6D4C41]">
                ₱
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white border-4 border-[#8D6E63] rounded-lg pl-12 pr-4 py-4 text-2xl text-[#3E2723] placeholder-[#BCAAA4] focus:outline-none focus:border-[#D2691E] shadow-[4px_4px_0_0_#6D4C41]"
                autoFocus
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
              FROM WALLET
            </label>
            <select
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-4 py-3 text-[#3E2723] focus:outline-none focus:border-[#D2691E] shadow-[4px_4px_0_0_#6D4C41] font-['Press_Start_2P'] text-[10px]"
            >
              {wallets.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#E8D5B7] hover:bg-[#D4B896] border-4 border-[#8D6E63] rounded-lg py-3 font-['Press_Start_2P'] text-[8px] text-[#3E2723] shadow-[3px_3px_0_0_#6D4C41] active:shadow-[1px_1px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#FFD966] hover:bg-[#FFD966]/80 border-4 border-[#3E2723] rounded-lg py-3 font-['Press_Start_2P'] text-[8px] text-[#3E2723] shadow-[3px_3px_0_0_#6D4C41] active:shadow-[1px_1px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              ADD MONEY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

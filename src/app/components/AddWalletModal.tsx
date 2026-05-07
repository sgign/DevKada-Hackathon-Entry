import { useState } from 'react';
import { X } from 'lucide-react';

interface AddWalletModalProps {
  onClose: () => void;
  onSubmit: (walletData: {
    name: string;
    amount: number;
  }) => void;
}

export function AddWalletModal({ onClose, onSubmit }: AddWalletModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      amount: parseFloat(amount) || 0
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#F5DEB3] border-t-4 border-[#8D6E63] rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#A8D5BA] px-6 py-4 border-b-4 border-[#8D6E63] flex items-center justify-between shadow-[0_4px_0_0_#6D4C41]">
          <h2 className="font-['Press_Start_2P'] text-xs text-[#3E2723]">
            ADD NEW WALLET
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
          {/* Wallet Name */}
          <div>
            <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
              WALLET NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Savings, Metrobank"
              className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-4 py-3 text-[#3E2723] placeholder-[#BCAAA4] focus:outline-none focus:border-[#D2691E] shadow-[4px_4px_0_0_#6D4C41]"
              autoFocus
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
              INITIAL BALANCE
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
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name || !amount}
            className="w-full bg-[#FFD966] hover:bg-[#FFD966]/80 disabled:bg-[#BCAAA4] disabled:cursor-not-allowed border-4 border-[#8D6E63] rounded-lg py-4 font-['Press_Start_2P'] text-xs text-[#3E2723] transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41]"
          >
            ADD WALLET
          </button>
        </form>
      </div>
    </div>
  );
}

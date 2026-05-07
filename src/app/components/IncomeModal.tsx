import { useState } from 'react';
import { X } from 'lucide-react';

interface IncomeModalProps {
  onClose: () => void;
  onSubmit: (incomeData: {
    amount: number;
    category: string;
    wallet: string;
    description: string;
    categoryEmoji: string;
  }) => void;
}

const CATEGORIES = [
  { id: 'salary', emoji: '💼', label: 'Salary' },
  { id: 'freelance', emoji: '💻', label: 'Freelance' },
  { id: 'business', emoji: '🏪', label: 'Business' },
  { id: 'investment', emoji: '📈', label: 'Investment' },
  { id: 'gift', emoji: '🎁', label: 'Gift' },
  { id: 'other', emoji: '💰', label: 'Other' },
];

const WALLETS = ['Cash', 'GCash', 'Landbank', 'BPI', 'Maya', 'BDO'];

export function IncomeModal({ onClose, onSubmit }: IncomeModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [wallet, setWallet] = useState('GCash');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = CATEGORIES.find(cat => cat.id === category);
    if (!selectedCategory) return;

    onSubmit({
      amount: parseFloat(amount),
      category: selectedCategory.label,
      wallet,
      description,
      categoryEmoji: selectedCategory.emoji
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#F5DEB3] border-t-4 border-[#8D6E63] rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#81C784] px-6 py-4 border-b-4 border-[#8D6E63] flex items-center justify-between shadow-[0_4px_0_0_#6B8E7C]">
          <h2 className="font-['VCR_OSD_Mono'] text-xs text-[#3E2723]">
            LOG INCOME
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
          {/* Amount */}
          <div>
            <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#D2691E] mb-3">
              AMOUNT
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
                className="w-full bg-white border-4 border-[#8D6E63] rounded-lg pl-12 pr-4 py-4 text-2xl text-[#3E2723] placeholder-[#BCAAA4] focus:outline-none focus:border-[#81C784] shadow-[4px_4px_0_0_#6D4C41]"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#D2691E] mb-3">
              CATEGORY
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-lg border-3 transition-all shadow-[3px_3px_0_0_#6D4C41] ${
                    category === cat.id
                      ? 'bg-[#81C784] border-[#2E7D32] scale-105'
                      : 'bg-white border-[#8D6E63] hover:border-[#81C784]'
                  }`}
                >
                  <div className="text-3xl mb-1">{cat.emoji}</div>
                  <p className="text-[8px] text-[#3E2723]">{cat.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Wallet */}
          <div>
            <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#D2691E] mb-3">
              ADD TO
            </label>
            <select
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-4 py-3 text-[#3E2723] focus:outline-none focus:border-[#81C784] shadow-[4px_4px_0_0_#6D4C41]"
            >
              {WALLETS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#D2691E] mb-3">
              DESCRIPTION (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Monthly salary"
              className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-4 py-3 text-[#3E2723] placeholder-[#BCAAA4] focus:outline-none focus:border-[#81C784] shadow-[4px_4px_0_0_#6D4C41]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!amount || !category}
            className="w-full bg-[#81C784] hover:bg-[#81C784]/80 disabled:bg-[#BCAAA4] disabled:cursor-not-allowed border-4 border-[#8D6E63] rounded-lg py-4 font-['VCR_OSD_Mono'] text-xs text-[#3E2723] transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41]"
          >
            SAVE INCOME
          </button>
        </form>
      </div>
    </div>
  );
}

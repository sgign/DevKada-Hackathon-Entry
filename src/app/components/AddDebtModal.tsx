import { useState } from 'react';
import { X } from 'lucide-react';

interface AddDebtModalProps {
  onClose: () => void;
  onSubmit: (debtData: {
    name: string;
    emoji: string;
    totalAmount: number;
    startDate: string;
    endDate: string;
  }) => void;
}

const DEBT_ICONS = [
  { id: 'credit-card', emoji: '💳', label: 'Credit Card' },
  { id: 'loan', emoji: '💰', label: 'Loan' },
  { id: 'refrigerator', emoji: '🧊', label: 'Appliance' },
  { id: 'car', emoji: '🚗', label: 'Vehicle' },
  { id: 'house', emoji: '🏠', label: 'House' },
  { id: 'education', emoji: '📚', label: 'Education' },
  { id: 'medical', emoji: '🏥', label: 'Medical' },
  { id: 'personal', emoji: '👤', label: 'Personal' },
  { id: 'gift', emoji: '🎁', label: 'Gift' },
  { id: 'other', emoji: '📋', label: 'Other' },
];

export function AddDebtModal({ onClose, onSubmit }: AddDebtModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [emoji, setEmoji] = useState('💳');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      alert('End date must be after start date');
      return;
    }

    // Format dates to MM/DD/YY
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${month}/${day}/${year}`;
    };

    onSubmit({
      name,
      emoji,
      totalAmount: parseFloat(amount),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#F5DEB3] border-t-4 border-[#8D6E63] rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#EF9A9A] px-6 py-4 border-b-4 border-[#8D6E63] flex items-center justify-between shadow-[0_4px_0_0_#6D4C41]">
          <h2 className="font-['Press_Start_2P'] text-xs text-[#3E2723]">
            ADD NEW DEBT
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
          {/* Debt Name */}
          <div>
            <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
              DEBT NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Credit Card Payment"
              className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-4 py-3 text-[#3E2723] placeholder-[#BCAAA4] focus:outline-none focus:border-[#D2691E] shadow-[4px_4px_0_0_#6D4C41]"
              autoFocus
              required
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
              ICON
            </label>
            <div className="grid grid-cols-5 gap-2">
              {DEBT_ICONS.map((icon) => (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => setEmoji(icon.emoji)}
                  className={`p-3 rounded-lg border-3 transition-all shadow-[3px_3px_0_0_#6D4C41] ${
                    emoji === icon.emoji
                      ? 'bg-[#EF9A9A] border-[#D32F2F] scale-105'
                      : 'bg-white border-[#8D6E63] hover:border-[#D2691E]'
                  }`}
                  title={icon.label}
                >
                  <div className="text-2xl">{icon.emoji}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
              TOTAL AMOUNT
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

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
                START DATE
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-3 py-3 text-[10px] text-[#3E2723] focus:outline-none focus:border-[#D2691E] shadow-[4px_4px_0_0_#6D4C41]"
                required
              />
            </div>
            <div>
              <label className="block font-['Press_Start_2P'] text-[8px] text-[#D2691E] mb-3">
                END DATE
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-3 py-3 text-[10px] text-[#3E2723] focus:outline-none focus:border-[#D2691E] shadow-[4px_4px_0_0_#6D4C41]"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name || !amount || !startDate || !endDate}
            className="w-full bg-[#A8D5BA] hover:bg-[#A8D5BA]/80 disabled:bg-[#BCAAA4] disabled:cursor-not-allowed border-4 border-[#8D6E63] rounded-lg py-4 font-['Press_Start_2P'] text-xs text-[#3E2723] transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41]"
          >
            ADD DEBT
          </button>
        </form>
      </div>
    </div>
  );
}

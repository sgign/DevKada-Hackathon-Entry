import { useState } from 'react';
import { X } from 'lucide-react';

interface AddSubscriptionModalProps {
  onClose: () => void;
  onSubmit: (subData: {
    name: string;
    amount: number;
    category: string;
    categoryEmoji: string;
    wallet: string;
    billingDay: number;
  }) => void;
}

const CATEGORIES = [
  { id: 'entertainment', emoji: '🎮', label: 'Fun' },
  { id: 'utilities', emoji: '🏠', label: 'Utilities' },
  { id: 'education', emoji: '📚', label: 'Education' },
  { id: 'health', emoji: '🏥', label: 'Health' },
  { id: 'other', emoji: '📦', label: 'Other' },
];

const WALLETS = ['Cash', 'GCash', 'Landbank', 'BPI', 'Maya', 'BDO'];

export function AddSubscriptionModal({ onClose, onSubmit }: AddSubscriptionModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [wallet, setWallet] = useState('GCash');
  const [billingDay, setBillingDay] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = CATEGORIES.find(cat => cat.id === category);
    if (!selectedCategory) return;

    onSubmit({
      name,
      amount: parseFloat(amount),
      category: selectedCategory.label,
      categoryEmoji: selectedCategory.emoji,
      wallet,
      billingDay: parseInt(billingDay)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#F5DEB3] border-4 border-[#8D6E63] rounded-lg shadow-[8px_8px_0_0_#6D4C41] max-h-[90vh] overflow-y-auto">
        <div className="bg-[#CE93D8] px-6 py-4 border-b-4 border-[#8D6E63] flex items-center justify-between">
          <h2 className="font-['VCR_OSD_Mono'] text-[10px] text-[#3E2723]">ADD SUBSCRIPTION</h2>
          <button onClick={onClose} className="text-[#3E2723] hover:scale-110 transition-transform"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#D2691E] mb-2">SERVICE NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Netflix, Spotify"
              className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#CE93D8]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#D2691E] mb-2">AMOUNT</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#CE93D8]"
                required
              />
            </div>
            <div>
              <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#D2691E] mb-2">BILLING DAY (1-31)</label>
              <input
                type="number"
                min="1"
                max="31"
                value={billingDay}
                onChange={(e) => setBillingDay(e.target.value)}
                className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#CE93D8]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#D2691E] mb-2">CATEGORY</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded border-2 text-center transition-all ${
                    category === cat.id ? 'bg-[#CE93D8] border-[#3E2723]' : 'bg-white border-[#8D6E63]'
                  }`}
                >
                  <div className="text-xl">{cat.emoji}</div>
                  <p className="text-[6px] mt-1 truncate">{cat.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#D2691E] mb-2">PAYMENT WALLET</label>
            <select
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full bg-white border-4 border-[#8D6E63] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#CE93D8]"
            >
              {WALLETS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#CE93D8] hover:bg-[#BA68C8] border-4 border-[#3E2723] rounded-lg py-4 font-['VCR_OSD_Mono'] text-[10px] text-[#3E2723] shadow-[4px_4px_0_0_#6D4C41] active:translate-y-1 active:shadow-none transition-all"
          >
            ACTIVATE SUBSCRIPTION
          </button>
        </form>
      </div>
    </div>
  );
}

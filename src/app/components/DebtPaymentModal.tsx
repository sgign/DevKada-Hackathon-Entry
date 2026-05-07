import { useState } from 'react';
import { X } from 'lucide-react';

interface DebtPaymentModalProps {
  debtName: string;
  remainingAmount: number;
  onClose: () => void;
  onSubmit: (paymentData: {
    amount: number;
    wallet: string;
  }) => void;
}

const WALLETS = ['Cash', 'GCash', 'Landbank', 'BPI', 'Maya', 'BDO'];

export function DebtPaymentModal({ debtName, remainingAmount, onClose, onSubmit }: DebtPaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('GCash');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount);

    if (paymentAmount > remainingAmount) {
      alert(`Payment amount cannot exceed remaining debt of ₱${remainingAmount.toLocaleString()}`);
      return;
    }

    onSubmit({
      amount: paymentAmount,
      wallet
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#F5DEB3] border-t-4 border-[#8D6E63] rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#81C784] px-6 py-4 border-b-4 border-[#8D6E63] flex items-center justify-between shadow-[0_4px_0_0_#6B8E7C]">
          <h2 className="font-['VCR_OSD_Mono'] text-xs text-[#3E2723]">
            ADD PAYMENT
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
          <div className="bg-white border-4 border-[#8D6E63] rounded-lg p-4 shadow-[4px_4px_0_0_#6D4C41]">
            <p className="text-[8px] text-[#6D4C41] mb-1">Paying for:</p>
            <p className="font-['VCR_OSD_Mono'] text-[10px] text-[#3E2723]">{debtName}</p>
            <p className="text-[8px] text-[#D32F2F] mt-2">
              Remaining: ₱{remainingAmount.toLocaleString()}
            </p>
          </div>

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
                max={remainingAmount}
                className="w-full bg-white border-4 border-[#8D6E63] rounded-lg pl-12 pr-4 py-4 text-2xl text-[#3E2723] placeholder-[#BCAAA4] focus:outline-none focus:border-[#81C784] shadow-[4px_4px_0_0_#6D4C41]"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Wallet */}
          <div>
            <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#D2691E] mb-3">
              PAY FROM
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!amount}
            className="w-full bg-[#81C784] hover:bg-[#81C784]/80 disabled:bg-[#BCAAA4] disabled:cursor-not-allowed border-4 border-[#8D6E63] rounded-lg py-4 font-['VCR_OSD_Mono'] text-xs text-[#3E2723] transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41]"
          >
            SAVE PAYMENT
          </button>
        </form>
      </div>
    </div>
  );
}

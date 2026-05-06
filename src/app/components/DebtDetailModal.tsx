import { X } from 'lucide-react';

interface DebtPayment {
  id: number;
  amount: number;
  date: string;
  wallet: string;
}

interface DebtDetailModalProps {
  debt: {
    id: number;
    name: string;
    emoji: string;
    totalAmount: number;
    paidAmount: number;
    startDate: string;
    endDate: string;
    payments: DebtPayment[];
  };
  onClose: () => void;
  onAddPayment: () => void;
}

export function DebtDetailModal({ debt, onClose, onAddPayment }: DebtDetailModalProps) {
  const percentage = (debt.paidAmount / debt.totalAmount) * 100;
  const remaining = debt.totalAmount - debt.paidAmount;

  // Calculate segments for donut chart
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const paidLength = (percentage / 100) * circumference;
  const remainingLength = circumference - paidLength;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#F5DEB3] border-t-4 border-[#8D6E63] rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#EF9A9A] px-6 py-4 border-b-4 border-[#8D6E63] flex items-center justify-between shadow-[0_4px_0_0_#6D4C41]">
          <div>
            <h2 className="font-['Press_Start_2P'] text-xs text-[#3E2723] mb-1">
              Debt tracker
            </h2>
            <p className="text-[8px] text-[#6D4C41]">{debt.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#3E2723] hover:text-[#D2691E] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Donut Chart */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-48 h-48 transform -rotate-90">
                {/* Remaining segment (background - gray) */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  fill="none"
                  stroke="#BCAAA4"
                  strokeWidth="32"
                />
                {/* Paid segment (foreground - green) */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  fill="none"
                  stroke="#81C784"
                  strokeWidth="32"
                  strokeDasharray={`${paidLength} ${remainingLength}`}
                  strokeLinecap="round"
                />
                {/* Center circle */}
                <circle cx="96" cy="96" r="54" fill="#FFF9E6" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl block mb-1">{debt.emoji}</span>
                  <span className="font-['Press_Start_2P'] text-[10px] text-[#3E2723]">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Debt Details */}
          <div className="bg-white border-4 border-[#8D6E63] rounded-lg p-4 shadow-[4px_4px_0_0_#6D4C41] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#6D4C41]">Amount Paid:</span>
              <span className="font-['Press_Start_2P'] text-[10px] text-[#81C784]">
                ₱{debt.paidAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#6D4C41]">Amount of Debt:</span>
              <span className="font-['Press_Start_2P'] text-[10px] text-[#D32F2F]">
                ₱{remaining.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#6D4C41]">Starting Date:</span>
              <span className="font-['Press_Start_2P'] text-[10px] text-[#3E2723]">
                {debt.startDate}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#6D4C41]">End date:</span>
              <span className="font-['Press_Start_2P'] text-[10px] text-[#3E2723]">
                {debt.endDate}
              </span>
            </div>
          </div>

          {/* Transaction Log */}
          <div className="bg-white border-4 border-[#8D6E63] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41]">
            <div className="bg-[#FFD966] px-4 py-2 border-b-4 border-[#8D6E63]">
              <h3 className="font-['Press_Start_2P'] text-[8px] text-[#3E2723]">
                Transaction Log
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FFF9E6] border-b-2 border-[#8D6E63]">
                  <tr>
                    <th className="px-3 py-2 text-left font-['Press_Start_2P'] text-[7px] text-[#3E2723]">
                      Amount Paid
                    </th>
                    <th className="px-3 py-2 text-left font-['Press_Start_2P'] text-[7px] text-[#3E2723]">
                      Date
                    </th>
                    <th className="px-3 py-2 text-left font-['Press_Start_2P'] text-[7px] text-[#3E2723]">
                      Wallet
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#E8D5B7]">
                  {debt.payments.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-4 text-center text-[8px] text-[#6D4C41]">
                        No payments yet
                      </td>
                    </tr>
                  ) : (
                    debt.payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-[#FFF9E6]">
                        <td className="px-3 py-2 text-[8px] text-[#81C784]">
                          ₱{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-[8px] text-[#3E2723]">
                          {payment.date}
                        </td>
                        <td className="px-3 py-2 text-[8px] text-[#3E2723]">
                          {payment.wallet}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Payment Button */}
          <button
            onClick={onAddPayment}
            className="w-full bg-[#81C784] hover:bg-[#81C784]/80 border-4 border-[#8D6E63] rounded-lg py-4 font-['Press_Start_2P'] text-xs text-[#3E2723] shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            + ADD PAYMENT
          </button>
        </div>
      </div>
    </div>
  );
}

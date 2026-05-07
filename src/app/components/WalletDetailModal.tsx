import { X } from 'lucide-react';
import { RecentTransactions } from './RecentTransactions';

interface Transaction {
  id: number;
  category: string;
  description: string;
  wallet: string;
  amount: number;
  time: string;
  type: 'expense' | 'income' | 'debt_payment';
}

interface WalletDetailModalProps {
  walletName: string;
  balance: number;
  transactions: Transaction[];
  style: { bg: string; icon: string; bgIcon: React.ReactNode; bgIconClass: string };
  onClose: () => void;
}

export function WalletDetailModal({ walletName, balance, transactions, style, onClose }: WalletDetailModalProps) {
  const filteredTransactions = transactions.filter(t => t.wallet === walletName);
  
  const totalSpent = filteredTransactions
    .filter(t => t.type === 'expense' || t.type === 'debt_payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#F5DEB3] border-t-4 border-[#8D6E63] rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 ${style.bg} px-6 py-4 border-b-4 border-[#8D6E63] flex items-center justify-between shadow-[0_4px_0_0_#6D4C41] z-10`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{style.icon}</span>
            <h2 className="font-['Press_Start_2P'] text-xs text-[#3E2723]">
              {walletName.toUpperCase()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#3E2723] hover:text-[#D2691E] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Balance */}
          <div className={`${style.bg} border-4 border-[#3E2723] rounded-lg p-6 shadow-[4px_4px_0_0_#6D4C41] relative overflow-hidden text-center`}>
            <p className="font-['Press_Start_2P'] text-[10px] text-[#3E2723] mb-3">CURRENT BALANCE</p>
            <p className="font-['Press_Start_2P'] text-2xl text-[#3E2723]">₱{balance.toLocaleString()}</p>
            <div className={`absolute bottom-2 right-2 ${style.bgIconClass} opacity-20 text-6xl`}>{style.bgIcon}</div>
          </div>

          {/* Wallet Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FFF9E6] border-3 border-[#8D6E63] rounded-lg p-3 text-center shadow-[3px_3px_0_0_#6D4C41]">
              <p className="font-['Press_Start_2P'] text-[10px] text-[#2E7D32] mb-2">₱{totalIncome.toLocaleString()}</p>
              <p className="text-[8px] font-bold text-[#6D4C41]">TOTAL IN</p>
            </div>
            <div className="bg-[#FFF9E6] border-3 border-[#8D6E63] rounded-lg p-3 text-center shadow-[3px_3px_0_0_#6D4C41]">
              <p className="font-['Press_Start_2P'] text-[10px] text-[#D32F2F] mb-2">₱{totalSpent.toLocaleString()}</p>
              <p className="text-[8px] font-bold text-[#6D4C41]">TOTAL OUT</p>
            </div>
          </div>

          {/* Transactions */}
          <div>
            <h3 className="font-['Press_Start_2P'] text-sm text-[#D2691E] mb-3">LOGS</h3>
            {filteredTransactions.length > 0 ? (
              <RecentTransactions transactions={filteredTransactions} />
            ) : (
              <div className="bg-[#FFF9E6] border-4 border-[#8D6E63] rounded-lg p-6 text-center shadow-[4px_4px_0_0_#6D4C41]">
                <span className="text-3xl mb-2 block">👻</span>
                <p className="font-['Press_Start_2P'] text-[10px] text-[#6D4C41]">No transactions yet!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

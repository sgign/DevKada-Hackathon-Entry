interface Transaction {
  id: number;
  category: string;
  description: string;
  wallet: string;
  amount: number;
  time: string;
  type: 'expense' | 'income' | 'debt_payment';
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  onDeleteTransaction?: (id: number) => void;
}

export function RecentTransactions({ transactions, onDeleteTransaction }: RecentTransactionsProps) {
  // Show only the 10 most recent transactions (increased from 5 for better visibility)
  const recentTransactions = transactions.slice(0, 10);

  return (
    <div className="bg-white border-4 border-[#8D6E63] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41]">
      <div className="bg-[#FFD966] px-4 py-2 border-b-4 border-[#8D6E63]">
        <h3 className="font-['Press_Start_2P'] text-[8px] text-[#3E2723]">
          RECENT TRANSACTIONS
        </h3>
      </div>

      <div className="divide-y-2 divide-[#E8D5B7]">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="p-3 hover:bg-[#FFF9E6] transition-colors group relative">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{transaction.category}</div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#3E2723] truncate">
                  {transaction.description}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-2 py-0.5 bg-[#A8D5BA] text-[#3E2723] rounded border-2 border-[#6B8E7C]">
                    {transaction.wallet}
                  </span>
                  <span className="text-[10px] text-[#6D4C41]">
                    {transaction.time}
                  </span>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <div>
                  <p className={`font-['Press_Start_2P'] text-[10px] ${
                    transaction.type === 'income' ? 'text-[#2E7D32]' : 'text-[#D32F2F]'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₱{transaction.amount}
                  </p>
                  {transaction.type === 'debt_payment' && (
                    <p className="text-[7px] text-[#6D4C41] mt-0.5">Debt</p>
                  )}
                </div>
                
                {onDeleteTransaction && (
                  <button 
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete transaction"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-3 bg-[#FFF9E6] hover:bg-[#FFD966]/50 border-t-4 border-[#8D6E63] transition-colors">
        <span className="font-['Press_Start_2P'] text-[8px] text-[#D2691E]">
          VIEW ALL →
        </span>
      </button>
    </div>
  );
}

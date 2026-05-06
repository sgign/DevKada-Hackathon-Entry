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
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Show only the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="bg-white border-4 border-[#8D6E63] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41]">
      <div className="bg-[#FFD966] px-4 py-2 border-b-4 border-[#8D6E63]">
        <h3 className="font-['Press_Start_2P'] text-[8px] text-[#3E2723]">
          RECENT TRANSACTIONS
        </h3>
      </div>

      <div className="divide-y-2 divide-[#E8D5B7]">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="p-3 hover:bg-[#FFF9E6] transition-colors">
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

              <div className="text-right">
                <p className={`font-['Press_Start_2P'] text-[10px] ${
                  transaction.type === 'income' ? 'text-[#2E7D32]' : 'text-[#D32F2F]'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₱{transaction.amount}
                </p>
                {transaction.type === 'debt_payment' && (
                  <p className="text-[7px] text-[#6D4C41] mt-0.5">Debt</p>
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

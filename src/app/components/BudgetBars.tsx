interface BudgetBarsProps {
  budget: {
    monthly: { spent: number; total: number };
  };
}

export function BudgetBars({ budget }: BudgetBarsProps) {
  const getMonthlyPercentage = () => (budget.monthly.spent / budget.monthly.total) * 100;

  const getBarColor = (percentage: number) => {
    if (percentage < 75) return '#81C784'; // green
    if (percentage < 90) return '#FFB74D'; // amber
    return '#E57373'; // red
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-3">
      {/* This Month's Budget */}
      <div className="bg-white border-4 border-[#8D6E63] rounded-lg p-4 shadow-[4px_4px_0_0_#6D4C41]">
        <div className="flex justify-between items-center mb-2">
          <span className="font-['Press_Start_2P'] text-[8px] text-[#D2691E]">THIS MONTH</span>
          <span className="text-xs text-[#6D4C41]">
            {formatCurrency(budget.monthly.spent)} / {formatCurrency(budget.monthly.total)}
          </span>
        </div>

        <div className="relative h-6 bg-[#E8D5B7] rounded border-3 border-[#3E2723] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 transition-all duration-500"
            style={{
              width: `${Math.min(getMonthlyPercentage(), 100)}%`,
              background: getBarColor(getMonthlyPercentage())
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-['Press_Start_2P'] text-[8px] text-[#3E2723] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              {Math.round(getMonthlyPercentage())}%
            </span>
          </div>
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
               }} />
        </div>

        <p className="text-[10px] text-[#6D4C41] mt-1 text-right">
          {formatCurrency(budget.monthly.total - budget.monthly.spent)} remaining
        </p>
      </div>
    </div>
  );
}

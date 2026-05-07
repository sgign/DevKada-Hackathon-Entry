interface DebtCardProps {
  debt: {
    id: number;
    name: string;
    emoji: string;
    totalAmount: number;
    paidAmount: number;
    startDate: string;
    endDate: string;
  };
  onClick: () => void;
}

export function DebtCard({ debt, onClick }: DebtCardProps) {
  const percentage = (debt.paidAmount / debt.totalAmount) * 100;
  const remaining = debt.totalAmount - debt.paidAmount;

  return (
    <button
      onClick={onClick}
      className="w-full bg-[#FFD966] border-4 border-[#3E2723] rounded-lg p-4 shadow-[4px_4px_0_0_#6D4C41] hover:shadow-[2px_2px_0_0_#6D4C41] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-left"
    >
      <div className="flex items-center gap-3">
        {/* Circular Progress */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#E8D5B7"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#EF9A9A"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - percentage / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">{debt.emoji}</span>
          </div>
        </div>

        {/* Debt Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-['VCR_OSD_Mono'] text-[10px] text-[#3E2723] mb-2 truncate">
            {debt.name}
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between text-[8px]">
              <span className="text-[#6D4C41]">Remaining:</span>
              <span className="font-['VCR_OSD_Mono'] text-[#D32F2F]">₱{remaining.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[8px]">
              <span className="text-[#6D4C41]">Total:</span>
              <span className="font-['VCR_OSD_Mono'] text-[#3E2723]">₱{debt.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[8px]">
              <span className="text-[#6D4C41]">Progress:</span>
              <span className="font-['VCR_OSD_Mono'] text-[#81C784]">{percentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

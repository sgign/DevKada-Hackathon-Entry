interface StreakCardProps {
  streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <div
      className="bg-gradient-to-r from-[#FFD966] to-[#FFA726] border-4 border-[#8D6E63] rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform shadow-[4px_4px_0_0_#6D4C41]"
      onClick={() => alert('Streak history coming soon!')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🔥</span>
          <div>
            <p className="font-['Press_Start_2P'] text-xs text-[#3E2723]">
              {streak} DAY STREAK
            </p>
            <p className="text-[8px] text-[#6D4C41] mt-1">Keep it up!</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-['Press_Start_2P'] text-[8px] text-[#D2691E]">
            🔥🔥🔥
          </p>
        </div>
      </div>
    </div>
  );
}

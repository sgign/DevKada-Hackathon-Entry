interface Friend {
  id: number;
  name: string;
  goal: number;
  saved: number;
  progress: number;
  avatar: string;
  rank: number;
}

export function Leaderboard() {
  // Mock friends data sorted by progress
  const friends: Friend[] = [
    {
      id: 1,
      name: 'Sarah',
      goal: 5000,
      saved: 4850,
      progress: 97,
      avatar: '🐷',
      rank: 1
    },
    {
      id: 2,
      name: 'Mike',
      goal: 3000,
      saved: 2700,
      progress: 90,
      avatar: '🐖',
      rank: 2
    },
    {
      id: 3,
      name: 'Emma',
      goal: 10000,
      saved: 8200,
      progress: 82,
      avatar: '🐽',
      rank: 3
    },
    {
      id: 4,
      name: 'Alex',
      goal: 2000,
      saved: 1500,
      progress: 75,
      avatar: '🐷',
      rank: 4
    },
    {
      id: 5,
      name: 'You',
      goal: 6000,
      saved: 4020,
      progress: 67,
      avatar: '🐷',
      rank: 5
    },
    {
      id: 6,
      name: 'Jen',
      goal: 8000,
      saved: 4800,
      progress: 60,
      avatar: '🐖',
      rank: 6
    },
    {
      id: 7,
      name: 'Tom',
      goal: 4000,
      saved: 2000,
      progress: 50,
      avatar: '🐽',
      rank: 7
    }
  ].sort((a, b) => b.progress - a.progress);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', color: 'bg-[#FFD700]', border: 'border-[#DAA520]' };
    if (rank === 2) return { emoji: '🥈', color: 'bg-[#C0C0C0]', border: 'border-[#A8A8A8]' };
    if (rank === 3) return { emoji: '🥉', color: 'bg-[#CD7F32]', border: 'border-[#B87333]' };
    return { emoji: `#${rank}`, color: 'bg-[#A8D5BA]', border: 'border-[#6B8E7C]' };
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-[#A8D5BA] border-4 border-[#8D6E63] rounded-lg p-3 shadow-[4px_4px_0_0_#6D4C41]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <h3 className="font-['VCR_OSD_Mono'] text-[10px] text-[#3E2723]">
              FRIEND GOALS
            </h3>
          </div>
          <span className="font-['VCR_OSD_Mono'] text-[8px] text-[#6D4C41]">
            {friends.length} PIGS
          </span>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {friends.map((friend) => {
          const badge = getRankBadge(friend.rank);
          const isCurrentUser = friend.name === 'You';

          return (
            <div
              key={friend.id}
              className={`bg-white border-4 rounded-lg p-3 transition-all ${
                isCurrentUser
                  ? 'border-[#F4A460] shadow-[4px_4px_0_0_#D2691E] ring-2 ring-[#F4A460]'
                  : 'border-[#8D6E63] shadow-[4px_4px_0_0_#6D4C41]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div
                  className={`flex-shrink-0 w-10 h-10 ${badge.color} border-2 ${badge.border} rounded flex items-center justify-center shadow-[2px_2px_0_0_#3E2723]`}
                >
                  <span className="text-xs">
                    {typeof badge.emoji === 'string' && badge.emoji.startsWith('#') ? (
                      <span className="font-['VCR_OSD_Mono'] text-[8px]">{badge.emoji}</span>
                    ) : (
                      badge.emoji
                    )}
                  </span>
                </div>

                {/* Friend Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{friend.avatar}</span>
                    <span className="font-['VCR_OSD_Mono'] text-[10px] text-[#3E2723] truncate">
                      {friend.name}
                      {isCurrentUser && (
                        <span className="ml-1 text-[#F4A460]">★</span>
                      )}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-1">
                    <div className="h-4 bg-[#E8D5B7] border-2 border-[#8D6E63] rounded overflow-hidden">
                      <div
                        className="h-full bg-[#A8D5BA] border-r-2 border-[#6B8E7C] transition-all duration-300"
                        style={{ width: `${friend.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-[8px] font-['VT323'] text-[#6D4C41]">
                    <span>
                      {formatCurrency(friend.saved)} / {formatCurrency(friend.goal)}
                    </span>
                    <span className="font-['VCR_OSD_Mono'] text-[8px] text-[#3E2723]">
                      {friend.progress}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Pig State Indicator */}
              {friend.progress >= 90 && (
                <div className="mt-2 pt-2 border-t-2 border-[#E8D5B7]">
                  <div className="flex items-center gap-1">
                    <span className="text-xs">✨</span>
                    <span className="font-['VCR_OSD_Mono'] text-[8px] text-[#81C784]">
                      ALMOST THERE!
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="bg-[#FFD966] border-4 border-[#8D6E63] rounded-lg p-3 shadow-[4px_4px_0_0_#6D4C41]">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">💪</span>
          <span className="font-['VCR_OSD_Mono'] text-[8px] text-[#3E2723]">
            KEEP SAVING!
          </span>
        </div>
      </div>
    </div>
  );
}

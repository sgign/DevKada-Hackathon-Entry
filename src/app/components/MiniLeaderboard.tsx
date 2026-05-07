import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Friend {
  id: number;
  name: string;
  progress: number;
  avatar: string;
  rank?: number;
}

interface Farm {
  id: number;
  name: string;
  type: 'solo' | 'collaborative';
  collaborators?: string[];
}

export function MiniLeaderboard({ farm }: { farm: Farm }) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [viewMode, setViewMode] = useState<'farm' | 'global'>('global');

  // Update viewMode automatically when the farm changes
  useEffect(() => {
    setViewMode(farm.type === 'collaborative' ? 'farm' : 'global');
  }, [farm]);

  // Extended mock data containing both global friends and farm collaborators
  const allFriends: Friend[] = [
    { id: 1, name: 'Sarah', progress: 97, avatar: '🐷' },
    { id: 2, name: 'Mike', progress: 90, avatar: '🐖' },
    { id: 3, name: 'Emma', progress: 82, avatar: '🐽' },
    { id: 4, name: 'Mom', progress: 95, avatar: '👩' },
    { id: 5, name: 'Dad', progress: 88, avatar: '👨' },
    { id: 6, name: 'Sister', progress: 75, avatar: '👧' },
    { id: 7, name: 'Ana', progress: 92, avatar: '👱‍♀️' },
    { id: 8, name: 'Ben', progress: 85, avatar: '👦' },
    { id: 9, name: 'Clara', progress: 78, avatar: '👩‍🦰' },
    { id: 10, name: 'You', progress: 67, avatar: '🐷' },
  ];

  let displayFriends = allFriends;
  
  if (viewMode === 'farm' && farm.type === 'collaborative' && farm.collaborators) {
    const collabNames = [...farm.collaborators.map(c => c.toLowerCase()), 'you'];
    displayFriends = allFriends.filter(f => collabNames.includes(f.name.toLowerCase()));
  }

  // Sort and assign ranks
  displayFriends = [...displayFriends]
    .sort((a, b) => b.progress - a.progress)
    .map((f, index) => ({
      ...f,
      rank: index + 1
    }))
    .slice(0, 5); // Show top 5 maximum for the mini view

  return (
    <div className="bg-white border-4 border-[#3E2723] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41] mt-4">
      <div 
        className="bg-[#FFD966] px-4 py-2 border-b-4 border-transparent flex justify-between items-center cursor-pointer hover:bg-[#FFD966]/80 transition-colors"
        onClick={() => setIsMinimized(!isMinimized)}
        style={{ borderBottomColor: isMinimized ? 'transparent' : '#8D6E63' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">🏆</span>
          <h3 className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">LEADERBOARD</h3>
        </div>
        {isMinimized ? <ChevronDown size={16} className="text-[#3E2723]" /> : <ChevronUp size={16} className="text-[#3E2723]" />}
      </div>

      {!isMinimized && (
        <div className="bg-[#FFF9E6]">
          {farm.type === 'collaborative' && (
            <div className="flex border-b-4 border-[#8D6E63]">
              <button
                className={`flex-1 py-2.5 font-['Press_Start_2P'] text-[7px] text-center transition-colors ${viewMode === 'farm' ? 'bg-[#A8D5BA] text-[#3E2723]' : 'bg-transparent text-[#6D4C41]'}`}
                onClick={(e) => { e.stopPropagation(); setViewMode('farm'); }}
              >
                FARM
              </button>
              <div className="w-[4px] bg-[#8D6E63]" />
              <button
                className={`flex-1 py-2.5 font-['Press_Start_2P'] text-[7px] text-center transition-colors ${viewMode === 'global' ? 'bg-[#A8D5BA] text-[#3E2723]' : 'bg-transparent text-[#6D4C41]'}`}
                onClick={(e) => { e.stopPropagation(); setViewMode('global'); }}
              >
                GLOBAL
              </button>
            </div>
          )}

          <div className="p-3 space-y-2">
            {displayFriends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-2 bg-white border-2 border-[#8D6E63] rounded p-2">
                <span className="font-['Press_Start_2P'] text-[8px] text-[#D2691E] w-6">#{friend.rank}</span>
                <span className="text-sm">{friend.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-['Press_Start_2P'] text-[7px] text-[#3E2723] truncate">
                      {friend.name} {friend.name === 'You' ? '★' : ''}
                    </span>
                    <span className="font-['Press_Start_2P'] text-[6px] text-[#6D4C41]">{friend.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#E8D5B7] rounded overflow-hidden border border-[#8D6E63]">
                    <div 
                      className="h-full bg-[#A8D5BA]" 
                      style={{ width: `${friend.progress}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
            {viewMode === 'global' && (
              <div className="pt-1 text-center">
                 <span className="font-['Press_Start_2P'] text-[6px] text-[#6D4C41] opacity-70">Check 'Board' tab for full list</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

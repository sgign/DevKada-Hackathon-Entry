import backgroundImg from "../../imports/background.png";
import pigNeutral from "../../imports/Neutral-1.png";

interface PigDisplayProps {
  state: {
    state: string;
    foodLevel: number;
    mood: string;
  };
  dailyBudget?: {
    spent: number;
    total: number;
  };
}

export function PigDisplay({ state, dailyBudget }: PigDisplayProps) {
  const budgetPercent = dailyBudget 
    ? Math.min(100, Math.round((dailyBudget.spent / dailyBudget.total) * 100))
    : 80;
  return (
    <div className="relative rounded-lg overflow-hidden border-4 border-[#8D6E63] min-h-[280px] shadow-[4px_4px_0_0_#6D4C41]"
         style={{
           backgroundImage: `url(${backgroundImg})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      {/* Pig Character */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
        {/* Speech bubble */}
        <div className="relative bg-white text-[#3E2723] px-3 py-2 rounded-lg border-4 border-[#3E2723] max-w-[200px] shadow-[3px_3px_0_0_#6D4C41]">
          <p className="font-['Press_Start_2P'] text-[8px] text-center leading-relaxed">
            {state.state === 'happy' && (dailyBudget ? `Budget: ₱${dailyBudget.spent}/₱${dailyBudget.total}` : "Saved 80% for new phone")}
            {state.state === 'full' && "I'm so full!"}
            {state.state === 'worried' && "Budget getting low..."}
            {state.state === 'sad' && "Please save more!"}
            {state.state === 'grumpy' && "Over budget!"}
            {!['happy', 'full', 'worried', 'sad', 'grumpy'].includes(state.state) && "Feed me by saving!"}
          </p>

          {/* Progress bar in speech bubble */}
          <div className="mt-2 bg-[#E8D5B7] h-2 rounded-full overflow-hidden border-2 border-[#3E2723]">
            <div
              className="h-full bg-[#81C784] transition-all duration-500"
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          <p className="text-[6px] text-center mt-1 text-[#6D4C41]">{budgetPercent}% spent</p>

          {/* Speech bubble pointer - pointing down */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-white" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-[#3E2723]" />
        </div>

        <div className="mt-2">
          <img src={pigNeutral} alt="Piggy" className="w-32 h-32" style={{ imageRendering: 'pixelated' }} />
        </div>

        {/* Food bowl */}
        <div className="mt-4 flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full border-3 border-[#3E2723] shadow-[2px_2px_0_0_#6D4C41]">
          <span className="text-lg">🍚</span>
          <div className="w-24 bg-[#E8D5B7] h-2 rounded-full overflow-hidden border-2 border-[#3E2723]">
            <div
              className="h-full bg-[#FFD966] transition-all duration-500"
              style={{ width: `${state.foodLevel}%` }}
            />
          </div>
          <span className="text-lg">
            {state.foodLevel > 75 ? '😊' : state.foodLevel > 50 ? '😐' : '😢'}
          </span>
        </div>
      </div>
    </div>
  );
}

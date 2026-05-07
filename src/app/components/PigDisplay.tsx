import backgroundImg from "../../imports/background.png";
import pigHappy from "../../imports/Happy.png";
import pigNeutral from "../../imports/Neutral.png";
import pigSad from "../../imports/Sad.png";
import pigGrumpy from "../../imports/Grumpy.png";
import pigSkinny from "../../imports/Skinny.png";
import pigVanished from "../../imports/Vanished.png";

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
  overBudgetDays?: number;
}

export function PigDisplay({ state, dailyBudget, overBudgetDays = 0 }: PigDisplayProps) {
  const budgetPercent = dailyBudget 
    ? Math.round((dailyBudget.spent / dailyBudget.total) * 100)
    : 0;

  const getMoodConfig = () => {
    // Priority: Days over budget
    if (overBudgetDays >= 3) {
      return {
        img: pigVanished,
        text: "I'M GONE! TOO MUCH SPENDING! 👋",
        color: "#9E9E9E",
        vanished: true
      };
    }
    if (overBudgetDays === 2) {
      return {
        img: pigSkinny,
        text: "Aren't you gonna feed me? Is it that hard to save money?",
        color: "#FF8A65"
      };
    }
    // Note: overBudgetDays === 1 is handled by the default "Angry/Grumpy" logic below if budgetPercent > 100

    if (!dailyBudget) {
      return { 
        img: pigNeutral, 
        text: "Feed me by saving!", 
        color: "#81C784" 
      };
    }

    if (budgetPercent <= 50) {
      return { 
        img: pigHappy, 
        text: `Happy! ₱${dailyBudget.spent}/₱${dailyBudget.total}`, 
        color: "#81C784" 
      };
    } else if (budgetPercent <= 75) {
      return { 
        img: pigNeutral, 
        text: "Doing okay...", 
        color: "#FFD54F" 
      };
    } else if (budgetPercent <= 100) {
      return { 
        img: pigSad, 
        text: "Budget low! 😟", 
        color: "#FF8A65" 
      };
    } else {
      return { 
        img: pigGrumpy, 
        text: "OVER BUDGET!! 💢", 
        color: "#E57373" 
      };
    }
  };

  const moodConfig = getMoodConfig();

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
        <div className="relative bg-white text-[#3E2723] px-3 py-2 rounded-lg border-4 border-[#3E2723] w-full max-w-[200px] shadow-[3px_3px_0_0_#6D4C41] min-h-[60px] flex flex-col justify-center">
          <p className="font-['Press_Start_2P'] text-[8px] text-center leading-relaxed">
            {moodConfig.text}
          </p>

          {/* Progress bar in speech bubble - hide if vanished */}
          {!(moodConfig as any).vanished && (
            <>
              <div className="mt-2 bg-[#E8D5B7] h-2 rounded-full overflow-hidden border-2 border-[#3E2723]">
                <div
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, budgetPercent)}%`,
                    backgroundColor: moodConfig.color 
                  }}
                />
              </div>
              <p className="text-[6px] text-center mt-1 text-[#6D4C41]">{budgetPercent}% spent</p>
            </>
          )}

          {/* Speech bubble pointer - pointing down */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-white" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-[#3E2723]" />
        </div>

        <div className="mt-2">
          <img src={moodConfig.img} alt="Piggy" className="w-32 h-32" style={{ imageRendering: 'pixelated' }} />
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

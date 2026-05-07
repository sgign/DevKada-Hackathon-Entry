import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, X } from 'lucide-react';

interface Transaction {
  id: number;
  category: string;
  description: string;
  wallet: string;
  amount: number;
  time: string;
  type: 'expense' | 'income' | 'debt_payment';
}

interface DayData {
  date: number;
  spent: number;
  income: number;
  transactions: Transaction[];
}

interface CalendarPageProps {
  onClose: () => void;
  transactions: Transaction[];
}

const CATEGORY_COLORS: Record<string, string> = {
  expense: '#EF9A9A',
  income: '#A8D5BA',
  debt_payment: '#CE93D8',
};

function buildDayMap(transactions: Transaction[]): Record<number, DayData> {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const map: Record<number, DayData> = {};

  const demoBase = [
    { day: 1,  cat: '🚌', desc: 'Transportation', wallet: 'Cash',  amount: 50,   type: 'expense' as const },
    { day: 1,  cat: '💰', desc: 'Allowance',      wallet: 'GCash', amount: 1000, type: 'income'  as const },
    { day: 2,  cat: '🍔', desc: 'Lunch',          wallet: 'GCash', amount: 250,  type: 'expense' as const },
    { day: 3,  cat: '☕', desc: 'Coffee',         wallet: 'GCash', amount: 150,  type: 'expense' as const },
    { day: 4,  cat: '📱', desc: 'Mobile load',    wallet: 'GCash', amount: 100,  type: 'expense' as const },
    { day: 5,  cat: '🎮', desc: 'Game credits',   wallet: 'GCash', amount: 200,  type: 'expense' as const },
    { day: 5,  cat: '💳', desc: 'Debt: Fridge',   wallet: 'GCash', amount: 500,  type: 'debt_payment' as const },
    { day: 6,  cat: '🏥', desc: 'Medicine',       wallet: 'Cash',  amount: 350,  type: 'expense' as const },
    { day: 7,  cat: '🎂', desc: 'Birthday cake',  wallet: 'GCash', amount: 450,  type: 'expense' as const },
    { day: 7,  cat: '💰', desc: 'Freelance pay',  wallet: 'BPI',   amount: 3000, type: 'income'  as const },
    { day: 9,  cat: '🛒', desc: 'Groceries',      wallet: 'Cash',  amount: 800,  type: 'expense' as const },
    { day: 10, cat: '🚌', desc: 'Fare',           wallet: 'Cash',  amount: 70,   type: 'expense' as const },
    { day: 12, cat: '🍔', desc: 'Dinner out',     wallet: 'GCash', amount: 500,  type: 'expense' as const },
    { day: 14, cat: '💰', desc: 'Salary',         wallet: 'BPI',   amount: 8000, type: 'income'  as const },
    { day: 15, cat: '📺', desc: 'Netflix',        wallet: 'GCash', amount: 199,  type: 'expense' as const },
    { day: 16, cat: '🛒', desc: 'Supermarket',    wallet: 'Cash',  amount: 1200, type: 'expense' as const },
    { day: 18, cat: '⚡', desc: 'Electric bill',  wallet: 'BPI',   amount: 600,  type: 'expense' as const },
    { day: 19, cat: '☕', desc: 'Café',           wallet: 'GCash', amount: 220,  type: 'expense' as const },
    { day: 20, cat: '🎮', desc: 'Game top-up',    wallet: 'GCash', amount: 300,  type: 'expense' as const },
    { day: 21, cat: '💳', desc: 'Debt: CC',       wallet: 'BPI',   amount: 1000, type: 'debt_payment' as const },
    { day: 22, cat: '🍔', desc: 'Lunch',          wallet: 'Cash',  amount: 180,  type: 'expense' as const },
    { day: 23, cat: '💰', desc: 'Side hustle',    wallet: 'GCash', amount: 1500, type: 'income'  as const },
    { day: 25, cat: '🛒', desc: 'Weekly grocery', wallet: 'Cash',  amount: 950,  type: 'expense' as const },
    { day: 26, cat: '🚌', desc: 'Grab',           wallet: 'GCash', amount: 120,  type: 'expense' as const },
    { day: 28, cat: '🏥', desc: 'Check-up',       wallet: 'Cash',  amount: 500,  type: 'expense' as const },
    { day: 29, cat: '🎂', desc: "Dad's bday",     wallet: 'GCash', amount: 600,  type: 'expense' as const },
    { day: 30, cat: '💰', desc: 'Bonus',          wallet: 'BPI',   amount: 2000, type: 'income'  as const },
  ];

  // Spread today's real transactions into today's bucket
  const todayDay = today.getDate();
  transactions.forEach((t) => {
    if (!map[todayDay]) map[todayDay] = { date: todayDay, spent: 0, income: 0, transactions: [] };
    map[todayDay].transactions.push(t);
    if (t.type === 'expense' || t.type === 'debt_payment') map[todayDay].spent += t.amount;
    if (t.type === 'income') map[todayDay].income += t.amount;
  });

  demoBase.forEach(({ day, cat, desc, wallet, amount, type }, idx) => {
    if (day > daysInMonth) return;
    if (!map[day]) map[day] = { date: day, spent: 0, income: 0, transactions: [] };
    const t: Transaction = { id: 10000 + idx, category: cat, description: desc, wallet, amount, time: `${day} May`, type };
    map[day].transactions.push(t);
    if (type === 'expense' || type === 'debt_payment') map[day].spent += amount;
    if (type === 'income') map[day].income += amount;
  });

  return map;
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS  = ['S','M','T','W','T','F','S'];

export function CalendarPage({ onClose, transactions }: CalendarPageProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const dayMap = buildDayMap(transactions);

  const daysInMonth    = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const totalCells     = Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  const isCurrentMonth = viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const selectedDayData: DayData | null =
    isCurrentMonth && selectedDay
      ? (dayMap[selectedDay] ?? { date: selectedDay, spent: 0, income: 0, transactions: [] })
      : null;

  const totalSpent  = Object.values(dayMap).reduce((s, d) => s + d.spent,  0);
  const totalIncome = Object.values(dayMap).reduce((s, d) => s + d.income, 0);
  const netTotal    = totalIncome - totalSpent;

  return (
    <div className="p-4 space-y-4">

      {/* Page header — same style as other pages */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="w-8 h-8 bg-[#EF9A9A] border-2 border-[#3E2723] rounded flex items-center justify-center shadow-[2px_2px_0_0_#3E2723] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
        >
          <ArrowLeft size={14} className="text-[#3E2723]" />
        </button>
        <h2 className="font-['Press_Start_2P'] text-sm text-[#D2691E]">Full Calendar</h2>
      </div>

      {/* Monthly summary card */}
      {isCurrentMonth && (
        <div className="bg-white border-4 border-[#3E2723] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41]">
          <div className="bg-[#64B5F6] border-b-4 border-[#8D6E63] px-4 py-2">
            <h3 className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">
              {MONTH_NAMES[viewMonth].toUpperCase()} {viewYear} SUMMARY
            </h3>
          </div>
          <div className="grid grid-cols-3 divide-x-2 divide-[#E8D5B7]">
            <div className="py-3 text-center bg-[#FFF5F5]">
              <p className="font-['Press_Start_2P'] text-[9px] text-[#D32F2F]">₱{totalSpent.toLocaleString()}</p>
              <p className="text-[7px] text-[#6D4C41] mt-1">Spent</p>
            </div>
            <div className="py-3 text-center bg-[#F5FFF5]">
              <p className="font-['Press_Start_2P'] text-[9px] text-[#2E7D32]">₱{totalIncome.toLocaleString()}</p>
              <p className="text-[7px] text-[#6D4C41] mt-1">Earned</p>
            </div>
            <div className="py-3 text-center bg-[#FFFDE7]">
              <p className={`font-['Press_Start_2P'] text-[9px] ${netTotal >= 0 ? 'text-[#2E7D32]' : 'text-[#D32F2F]'}`}>
                {netTotal >= 0 ? '+' : ''}₱{netTotal.toLocaleString()}
              </p>
              <p className="text-[7px] text-[#6D4C41] mt-1">Net</p>
            </div>
          </div>
        </div>
      )}

      {/* Calendar card */}
      <div className="bg-white border-4 border-[#3E2723] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41]">

        {/* Month navigator */}
        <div className="bg-[#FFD966] border-b-4 border-[#8D6E63] px-3 py-2 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="w-7 h-7 bg-white border-2 border-[#3E2723] rounded flex items-center justify-center shadow-[2px_2px_0_0_#6D4C41] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <ChevronLeft size={12} className="text-[#3E2723]" />
          </button>
          <span className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">
            {MONTH_NAMES[viewMonth].slice(0,3).toUpperCase()} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            className="w-7 h-7 bg-white border-2 border-[#3E2723] rounded flex items-center justify-center shadow-[2px_2px_0_0_#6D4C41] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <ChevronRight size={12} className="text-[#3E2723]" />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 border-b-2 border-[#E8D5B7]">
          {DAY_LABELS.map((d, i) => (
            <div
              key={i}
              className="text-center py-1.5 font-['Press_Start_2P'] text-[7px] text-[#8D6E63]"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid — taller cells with mini summary tabs */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#F0E6D3]">
          {Array.from({ length: totalCells }).map((_, idx) => {
            const dayNum  = idx - firstDayOfWeek + 1;
            const isValid = dayNum >= 1 && dayNum <= daysInMonth;
            const isToday = isCurrentMonth && isValid && dayNum === today.getDate();
            const data    = isCurrentMonth && isValid ? dayMap[dayNum] : null;
            const isSelected = selectedDay === dayNum && isValid;

            // cell background based on state
            let cellBg = 'bg-white';
            if (!isValid)    cellBg = 'bg-[#F5EDE0]';
            else if (isSelected) cellBg = 'bg-[#FFF3CD]';
            else if (isToday)    cellBg = 'bg-[#E3F2FD]';
            else if (data && data.income > 0 && data.spent === 0) cellBg = 'bg-[#F0FFF4]';

            return (
              <button
                key={idx}
                disabled={!isValid}
                onClick={() => isValid && setSelectedDay(dayNum === selectedDay ? null : dayNum)}
                className={`
                  relative flex flex-col items-stretch text-left transition-all
                  ${cellBg}
                  ${isValid ? 'hover:brightness-95 active:scale-95' : 'cursor-default'}
                  ${isSelected ? 'ring-2 ring-inset ring-[#D2691E]' : ''}
                `}
                style={{ minHeight: '62px' }}
              >
                {/* Day number + today marker */}
                <div className="flex items-center justify-between px-1 pt-1">
                  <span
                    className={`font-['Press_Start_2P'] text-[8px] leading-none
                      ${!isValid ? 'text-transparent' : isToday ? 'text-[#1565C0]' : isSelected ? 'text-[#D2691E]' : 'text-[#3E2723]'}
                    `}
                  >
                    {isValid ? dayNum : ''}
                  </span>
                  {isToday && (
                    <span className="text-[5px] font-['Press_Start_2P'] text-[#1565C0] leading-none">NOW</span>
                  )}
                </div>

                {/* Mini summary tabs — only show if there's data */}
                {isValid && data && (
                  <div className="flex flex-col gap-0.5 px-1 pb-1 mt-0.5">
                    {data.spent > 0 && (
                      <div className="flex items-center gap-0.5 bg-[#FFEBEE] border border-[#FFCDD2] rounded px-1 py-0.5">
                        <div className="w-1 h-1 rounded-full bg-[#EF5350] flex-shrink-0" />
                        <span className="font-['Press_Start_2P'] text-[5.5px] text-[#C62828] leading-none truncate">
                          ₱{data.spent >= 1000 ? `${(data.spent / 1000).toFixed(1)}k` : data.spent}
                        </span>
                      </div>
                    )}
                    {data.income > 0 && (
                      <div className="flex items-center gap-0.5 bg-[#E8F5E9] border border-[#C8E6C9] rounded px-1 py-0.5">
                        <div className="w-1 h-1 rounded-full bg-[#4CAF50] flex-shrink-0" />
                        <span className="font-['Press_Start_2P'] text-[5.5px] text-[#2E7D32] leading-none truncate">
                          +₱{data.income >= 1000 ? `${(data.income / 1000).toFixed(1)}k` : data.income}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty day — faint dash so it doesn't look broken */}
                {isValid && !data && (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[#DDD0BE] text-[8px]">·</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 px-3 py-2 bg-[#FAF3E8] border-t-2 border-[#E8D5B7]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#EF5350]" />
            <span className="text-[7px] text-[#6D4C41]">Expense</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#4CAF50]" />
            <span className="text-[7px] text-[#6D4C41]">Income</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-2 rounded bg-[#E3F2FD] border border-[#90CAF9]" />
            <span className="text-[7px] text-[#6D4C41]">Today</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-[7px] text-[#6D4C41]">tap day for details</span>
          </div>
        </div>
      </div>

      {/* Day detail panel — slides in below the calendar */}
      {selectedDayData !== null && (
        <div className="bg-white border-4 border-[#3E2723] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41]">
          {/* Panel header */}
          <div className="bg-[#FFD966] border-b-4 border-[#8D6E63] px-4 py-2 flex items-center justify-between">
            <span className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">
              📅 {MONTH_NAMES[viewMonth].slice(0,3).toUpperCase()} {selectedDay}
            </span>
            <button
              onClick={() => setSelectedDay(null)}
              className="w-6 h-6 flex items-center justify-center text-[#6D4C41] hover:text-[#D32F2F] transition-colors"
            >
              <X size={12} />
            </button>
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-3 divide-x-2 divide-[#E8D5B7] border-b-2 border-[#E8D5B7]">
            {[
              { label: 'Spent',  value: `₱${selectedDayData.spent.toLocaleString()}`,  color: '#D32F2F', bg: '#FFF5F5' },
              { label: 'Earned', value: `₱${selectedDayData.income.toLocaleString()}`, color: '#2E7D32', bg: '#F5FFF5' },
              {
                label: 'Net',
                value: `${selectedDayData.income - selectedDayData.spent >= 0 ? '+' : ''}₱${(selectedDayData.income - selectedDayData.spent).toLocaleString()}`,
                color: selectedDayData.income - selectedDayData.spent >= 0 ? '#2E7D32' : '#D32F2F',
                bg: '#FFFDE7',
              },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="py-3 text-center" style={{ background: bg }}>
                <p className="font-['Press_Start_2P'] text-[9px]" style={{ color }}>{value}</p>
                <p className="text-[7px] text-[#8D6E63] mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Transactions list */}
          {selectedDayData.transactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-3xl mb-2">😴</p>
              <p className="font-['Press_Start_2P'] text-[8px] text-[#8D6E63]">No activity</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-[#F5EDE0]">
              {selectedDayData.transactions.map((t, i) => (
                <div
                  key={`${t.id}-${i}`}
                  className="flex items-center gap-3 px-4 py-2.5"
                  style={{ background: i % 2 === 0 ? '#FDFAF4' : '#FFFFFF' }}
                >
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ background: CATEGORY_COLORS[t.type] }}
                  />
                  <span className="text-base flex-shrink-0">{t.category}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Press_Start_2P'] text-[8px] text-[#3E2723] truncate">{t.description}</p>
                    <p className="text-[7px] text-[#8D6E63]">{t.wallet}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className="font-['Press_Start_2P'] text-[9px]"
                      style={{
                        color: t.type === 'income' ? '#2E7D32' : t.type === 'debt_payment' ? '#7B1FA2' : '#D32F2F'
                      }}
                    >
                      {t.type === 'income' ? '+' : '-'}₱{t.amount.toLocaleString()}
                    </p>
                    <p className="text-[7px] text-[#8D6E63] capitalize">{t.type.replace('_', ' ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

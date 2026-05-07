import { useState, useEffect } from 'react';
import { Home, PlusCircle, Users, Trophy, User, Receipt } from 'lucide-react';
import { PigDisplay } from './components/PigDisplay';
import { BudgetBars } from './components/BudgetBars';
import { QuickActions } from './components/QuickActions';
import { RecentTransactions } from './components/RecentTransactions';
import { StreakCard } from './components/StreakCard';
import { ExpenseModal } from './components/ExpenseModal';
import { IncomeModal } from './components/IncomeModal';
import { Leaderboard } from './components/Leaderboard';
import { DebtCard } from './components/DebtCard';
import { DebtDetailModal } from './components/DebtDetailModal';
import { DebtPaymentModal } from './components/DebtPaymentModal';
import { AddDebtModal } from './components/AddDebtModal';
import { DebtCompletionModal } from './components/DebtCompletionModal';
import { PigGoalModal } from './components/PigGoalModal';
import { AddPigGoalModal } from './components/AddPigGoalModal';
import { AddWalletModal } from './components/AddWalletModal';
import { WalletDetailModal } from './components/WalletDetailModal';
import { CalendarPage } from './components/CalendarPage';
import pigAvatar from '../imports/Neutral-1.png';
import farmBackground from '../imports/Screenshot_2026-05-06_at_15.44.08.png';
import farmScene from '../imports/farm__no_pigs_.png';

interface Transaction {
  id: number;
  category: string;
  description: string;
  wallet: string;
  amount: number;
  time: string;
  type: 'expense' | 'income' | 'debt_payment';
}

interface DebtPayment {
  id: number;
  amount: number;
  date: string;
  wallet: string;
}

interface Debt {
  id: number;
  name: string;
  emoji: string;
  totalAmount: number;
  paidAmount: number;
  startDate: string;
  endDate: string;
  payments: DebtPayment[];
}

interface PigGoal {
  name: string;
  emoji: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

interface Farm {
  id: number;
  name: string;
  type: 'solo' | 'collaborative';
  numPigs: number;
  collaborators?: string[];
  pigGoals: PigGoal[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [showDebtPaymentModal, setShowDebtPaymentModal] = useState(false);
  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [walletMetadata, setWalletMetadata] = useState<Record<string, { color: string, emoji: string }>>({});
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [completedDebt, setCompletedDebt] = useState<Debt | null>(null);
  const [coins, setCoins] = useState(67);
  const [streak, setStreak] = useState(57);

  // Farms state
  const [farms, setFarms] = useState<Farm[]>([
    {
      id: 1,
      name: "Shane's Farm",
      type: 'solo',
      numPigs: 3,
      pigGoals: [
        { name: 'New Phone', emoji: '📱', targetAmount: 25000, savedAmount: 15000, deadline: '12/31/26' },
        { name: 'Vacation', emoji: '✈️', targetAmount: 20000, savedAmount: 5000, deadline: '06/15/27' },
        { name: 'Emergency Fund', emoji: '💰', targetAmount: 50000, savedAmount: 30000, deadline: '12/31/27' },
      ]
    },
    {
      id: 2,
      name: "Family Farm",
      type: 'collaborative',
      numPigs: 8,
      collaborators: ['Mom', 'Dad', 'Sister'],
      pigGoals: [
        { name: 'New Car', emoji: '🚗', targetAmount: 500000, savedAmount: 250000, deadline: '12/31/27' },
        { name: 'Home Renovation', emoji: '🏠', targetAmount: 300000, savedAmount: 100000, deadline: '06/30/27' },
        { name: 'Family Vacation', emoji: '🏖️', targetAmount: 80000, savedAmount: 50000, deadline: '03/15/27' },
        { name: 'Medical Fund', emoji: '🏥', targetAmount: 100000, savedAmount: 40000, deadline: '12/31/26' },
        { name: 'Education Fund', emoji: '📚', targetAmount: 150000, savedAmount: 80000, deadline: '06/30/28' },
        { name: 'Business Capital', emoji: '🏪', targetAmount: 200000, savedAmount: 120000, deadline: '09/30/27' },
        { name: 'Appliances', emoji: '📺', targetAmount: 60000, savedAmount: 35000, deadline: '08/31/26' },
        { name: 'Wedding Fund', emoji: '💍', targetAmount: 250000, savedAmount: 150000, deadline: '12/31/27' },
      ]
    },
    {
      id: 3,
      name: "Friends Farm",
      type: 'collaborative',
      numPigs: 5,
      collaborators: ['Ana', 'Ben', 'Clara'],
      pigGoals: [
        { name: 'Group Trip', emoji: '🎒', targetAmount: 100000, savedAmount: 60000, deadline: '07/15/27' },
        { name: 'Concert Tickets', emoji: '🎵', targetAmount: 30000, savedAmount: 20000, deadline: '05/20/26' },
        { name: 'Gaming Setup', emoji: '🎮', targetAmount: 80000, savedAmount: 45000, deadline: '10/31/26' },
        { name: 'Party Fund', emoji: '🎉', targetAmount: 40000, savedAmount: 25000, deadline: '12/25/26' },
        { name: 'Camping Gear', emoji: '⛺', targetAmount: 50000, savedAmount: 30000, deadline: '04/30/27' },
      ]
    },
  ]);
  const [selectedFarmId, setSelectedFarmId] = useState(1);
  const [selectedPigIndex, setSelectedPigIndex] = useState<number | null>(null);

  const selectedFarm = farms.find(f => f.id === selectedFarmId) || farms[0];

  // Wallet balances
  const [walletBalances, setWalletBalances] = useState<Record<string, number>>({
    'Cash': 5000,
    'GCash': 5000,
    'Landbank': 5000,
    'BPI': 5000,
    'Maya': 0,
    'BDO': 0
  });

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, category: '🍔', description: 'Lunch at Jollibee', wallet: 'GCash', amount: 250, time: '2h ago', type: 'expense' },
    { id: 2, category: '🚌', description: 'Jeepney fare', wallet: 'Cash', amount: 50, time: '4h ago', type: 'expense' },
    { id: 3, category: '☕', description: 'Coffee', wallet: 'GCash', amount: 150, time: '5h ago', type: 'expense' },
    { id: 4, category: '📱', description: 'Mobile load', wallet: 'GCash', amount: 100, time: '1d ago', type: 'expense' },
    { id: 5, category: '🎮', description: 'Game credits', wallet: 'GCash', amount: 200, time: '1d ago', type: 'expense' },
  ]);

  // Debts state
  const [debts, setDebts] = useState<Debt[]>([
    {
      id: 1,
      name: 'Refrigerator',
      emoji: '🧊',
      totalAmount: 18000,
      paidAmount: 12000,
      startDate: '04/01/26',
      endDate: '12/31/26',
      payments: [
        { id: 1, amount: 5000, date: '04/15/26', wallet: 'GCash' },
        { id: 2, amount: 4000, date: '05/01/26', wallet: 'Cash' },
        { id: 3, amount: 3000, date: '05/05/26', wallet: 'BPI' },
      ]
    },
    {
      id: 2,
      name: "Mama's Birthday",
      emoji: '🎂',
      totalAmount: 5000,
      paidAmount: 2000,
      startDate: '03/15/26',
      endDate: '06/15/26',
      payments: [
        { id: 1, amount: 2000, date: '04/01/26', wallet: 'GCash' },
      ]
    },
    {
      id: 3,
      name: 'Credit Card',
      emoji: '💳',
      totalAmount: 8000,
      paidAmount: 3500,
      startDate: '04/10/26',
      endDate: '05/15/26',
      payments: [
        { id: 1, amount: 2000, date: '04/20/26', wallet: 'Landbank' },
        { id: 2, amount: 1500, date: '05/02/26', wallet: 'GCash' },
      ]
    }
  ]);

  // Budget totals (user-defined limits)
  const [budget] = useState({
    daily: { total: 600 },
    monthly: { total: 18000 }
  });

  const [pigState] = useState({
    state: 'happy',
    foodLevel: 75,
    mood: 'content'
  });

  // Handle expense submission
  const handleAddExpense = (expenseData: {
    amount: number;
    category: string;
    wallet: string;
    description: string;
    categoryEmoji: string;
  }) => {
    // Create new transaction
    const newTransaction: Transaction = {
      id: Date.now(),
      category: expenseData.categoryEmoji,
      description: expenseData.description || expenseData.category,
      wallet: expenseData.wallet,
      amount: expenseData.amount,
      time: 'Just now',
      type: 'expense'
    };

    // Add transaction
    setTransactions(prev => [newTransaction, ...prev]);

    // Deduct from wallet
    setWalletBalances(prev => ({
      ...prev,
      [expenseData.wallet]: prev[expenseData.wallet] - expenseData.amount
    }));

    setShowExpenseModal(false);
  };

  // Handle income submission
  const handleAddIncome = (incomeData: {
    amount: number;
    category: string;
    wallet: string;
    description: string;
    categoryEmoji: string;
  }) => {
    // Create new transaction
    const newTransaction: Transaction = {
      id: Date.now(),
      category: incomeData.categoryEmoji,
      description: incomeData.description || incomeData.category,
      wallet: incomeData.wallet,
      amount: incomeData.amount,
      time: 'Just now',
      type: 'income'
    };

    // Add transaction
    setTransactions(prev => [newTransaction, ...prev]);

    // Add to wallet
    setWalletBalances(prev => ({
      ...prev,
      [incomeData.wallet]: prev[incomeData.wallet] + incomeData.amount
    }));

    setShowIncomeModal(false);
  };

  // Handle debt payment submission
  const handleAddDebtPayment = (paymentData: {
    amount: number;
    wallet: string;
  }) => {
    if (!selectedDebt) return;

    // Create payment record
    const newPayment: DebtPayment = {
      id: Date.now(),
      amount: paymentData.amount,
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
      wallet: paymentData.wallet
    };

    const newPaidAmount = selectedDebt.paidAmount + paymentData.amount;
    const isDebtCompleted = newPaidAmount >= selectedDebt.totalAmount;

    // Update debt
    let updatedDebt: Debt | null = null;
    setDebts(prev => prev.map(debt => {
      if (debt.id === selectedDebt.id) {
        updatedDebt = {
          ...debt,
          paidAmount: newPaidAmount,
          payments: [...debt.payments, newPayment]
        };
        return updatedDebt;
      }
      return debt;
    }));

    // Update selected debt to reflect changes in the modal
    if (updatedDebt) {
      setSelectedDebt(updatedDebt);
    }

    // Deduct from wallet
    setWalletBalances(prev => ({
      ...prev,
      [paymentData.wallet]: prev[paymentData.wallet] - paymentData.amount
    }));

    // Create transaction record (as debt_payment, not expense)
    const newTransaction: Transaction = {
      id: Date.now(),
      category: '💳',
      description: `Debt payment: ${selectedDebt.name}`,
      wallet: paymentData.wallet,
      amount: paymentData.amount,
      time: 'Just now',
      type: 'debt_payment'
    };

    setTransactions(prev => [newTransaction, ...prev]);

    setShowDebtPaymentModal(false);

    // Check if debt is fully paid
    if (isDebtCompleted && updatedDebt) {
      setCompletedDebt(updatedDebt);
      setSelectedDebt(null);
    }
  };

  // Handle adding new debt
  const handleAddDebt = (debtData: {
    name: string;
    emoji: string;
    totalAmount: number;
    startDate: string;
    endDate: string;
  }) => {
    const newDebt: Debt = {
      id: Date.now(),
      name: debtData.name,
      emoji: debtData.emoji,
      totalAmount: debtData.totalAmount,
      paidAmount: 0,
      startDate: debtData.startDate,
      endDate: debtData.endDate,
      payments: []
    };

    setDebts(prev => [...prev, newDebt]);
    setShowAddDebtModal(false);
  };

  // Handle adding new wallet
  const handleAddWallet = (walletData: { name: string; amount: number; color: string; emoji: string }) => {
    setWalletBalances(prev => ({
      ...prev,
      [walletData.name]: walletData.amount
    }));
    setWalletMetadata(prev => ({
      ...prev,
      [walletData.name]: { color: walletData.color, emoji: walletData.emoji }
    }));
    setShowAddWalletModal(false);
  };

  // Handle adding new pig goal
  const handleAddGoal = (goalData: { name: string; targetAmount: number; emoji: string; deadline: string }) => {
    setFarms(prev => prev.map(farm => {
      if (farm.id === selectedFarmId) {
        return {
          ...farm,
          numPigs: farm.numPigs + 1,
          pigGoals: [...farm.pigGoals, {
            name: goalData.name,
            targetAmount: goalData.targetAmount,
            savedAmount: 0,
            emoji: goalData.emoji,
            deadline: goalData.deadline,
            color: 'bg-[#FFD966]'
          }]
        };
      }
      return farm;
    }));
    setShowAddGoalModal(false);
  };

  // Helper for dynamic wallet styles
  const getWalletStyle = (name: string, index: number) => {
    if (walletMetadata[name]) {
      return { 
        bg: walletMetadata[name].color, 
        icon: walletMetadata[name].emoji, 
        bgIcon: walletMetadata[name].emoji, 
        bgIconClass: 'text-2xl opacity-50' 
      };
    }

    switch (name) {
      case 'Cash': return { bg: 'bg-[#FFD966]', icon: '💰', bgIcon: '💰', bgIconClass: 'text-3xl opacity-50' };
      case 'GCash': return { bg: 'bg-[#64B5F6]', icon: '💳', bgIcon: <div className="w-8 h-8 bg-[#2196F3] rounded-full border-2 border-[#3E2723] flex items-center justify-center"><span className="text-white font-bold text-xs">G</span></div>, bgIconClass: '' };
      case 'Landbank': return { bg: 'bg-[#A8D5BA]', icon: '🏦', bgIcon: '💳', bgIconClass: 'text-2xl opacity-50' };
      case 'BPI': return { bg: 'bg-[#EF9A9A]', icon: '🏦', bgIcon: '💳', bgIconClass: 'text-2xl opacity-50' };
      case 'Maya': return { bg: 'bg-[#CE93D8]', icon: '💳', bgIcon: '💳', bgIconClass: 'text-2xl opacity-50' };
      case 'BDO': return { bg: 'bg-[#81D4FA]', icon: '🏦', bgIcon: '🏦', bgIconClass: 'text-2xl opacity-50' };
      default: 
        const colors = ['bg-[#FFCC80]', '#BCAAA4', 'bg-[#B2DFDB]', 'bg-[#FFAB91]', 'bg-[#9FA8DA]'];
        return { bg: colors[index % colors.length], icon: '💳', bgIcon: '💳', bgIconClass: 'text-2xl opacity-50' };
    }
  };

  // Handle removing completed debt
  const handleRemoveDebt = () => {
    if (!completedDebt) return;

    setDebts(prev => prev.filter(debt => debt.id !== completedDebt.id));
    setCompletedDebt(null);
  };

  // Handle adding pig to selected farm
  const handleAddPig = () => {
    setFarms(prev => prev.map(farm =>
      farm.id === selectedFarmId
        ? { ...farm, numPigs: farm.numPigs + 1 }
        : farm
    ));
  };

  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  // Calculate monthly statistics
  const calculateMonthlyStats = () => {
    const totalSpent = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const transactionCount = transactions.length;

    // Calculate top category
    const categoryTotals: { [key: string]: { emoji: string; total: number } } = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const key = t.description;
        if (!categoryTotals[key]) {
          categoryTotals[key] = { emoji: t.category, total: 0 };
        }
        categoryTotals[key].total += t.amount;
      });

    const topCategory = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b.total - a.total)[0];

    return {
      totalSpent,
      totalIncome,
      transactionCount,
      topCategory: topCategory ? {
        name: topCategory[0],
        emoji: topCategory[1].emoji,
        total: topCategory[1].total
      } : null
    };
  };

  const monthlyStats = calculateMonthlyStats();

  return (
    <div className="min-h-screen bg-[#F5DEB3] text-[#3E2723] relative overflow-hidden">
      {/* Pixel dots pattern overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
           style={{
             backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
             backgroundSize: '4px 4px'
           }} />

      {/* Mobile Container */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
        {/* Top Bar */}
        <div className="px-4 py-3 flex items-center justify-between border-b-4 border-[#8D6E63] bg-[#A8D5BA] shadow-[0_4px_0_0_#6B8E7C]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐷</span>
            <span className="font-['Press_Start_2P'] text-[10px] text-[#3E2723]">PIGGY BANK</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-[#FFD966] px-2 py-1 rounded border-2 border-[#3E2723] shadow-[2px_2px_0_0_#3E2723]">
              <span className="text-xs">💰</span>
              <span className="font-['Press_Start_2P'] text-[10px] text-[#3E2723]">{coins}</span>
            </div>
            <button className="text-xl">🔔</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          {activeTab === 'home' && (
            <div className="p-4 space-y-4">
              {/* Greeting & Streak */}
              <div className="relative flex justify-center items-center">
                <div className="text-center">
                  <h1 className="font-['Press_Start_2P'] text-sm text-[#D2691E] mb-1">
                    Good {getCurrentTime()}!
                  </h1>
                  <p className="text-xs text-[#6D4C41]">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div 
                  className="absolute right-0 flex items-center gap-1 bg-gradient-to-r from-[#FFD966] to-[#FFA726] px-2 py-1 rounded border-2 border-[#3E2723] shadow-[2px_2px_0_0_#3E2723] cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => alert('Streak history coming soon!')}
                >
                  <span className="text-xs">🔥</span>
                  <span className="font-['Press_Start_2P'] text-[10px] text-[#3E2723]">{streak}</span>
                </div>
              </div>

              {/* Pig Display */}
              <PigDisplay 
                state={pigState} 
                dailyBudget={{ spent: monthlyStats.totalSpent, total: budget.daily.total }} 
              />


              {/* Wallet Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(walletBalances).map(([name, balance], index) => {
                  const style = getWalletStyle(name, index);
                  return (
                    <div 
                      key={name} 
                      onClick={() => setSelectedWallet(name)}
                      className={`${style.bg} border-4 border-[#3E2723] rounded-lg p-4 shadow-[4px_4px_0_0_#6D4C41] relative overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">{name}</span>
                        <span className="text-xs">{style.icon}</span>
                      </div>
                      <p className="font-['Press_Start_2P'] text-sm text-[#3E2723] mb-2">{balance.toLocaleString()}</p>
                      <div className={`absolute bottom-2 right-2 ${style.bgIconClass}`}>{style.bgIcon}</div>
                    </div>
                  );
                })}
              </div>

              {/* Add Account Button */}
              <button 
                onClick={() => setShowAddWalletModal(true)}
                className="w-full bg-[#3E2723] hover:bg-[#6D4C41] border-4 border-[#3E2723] rounded-lg py-3 font-['Press_Start_2P'] text-[9px] text-[#A8D5BA] shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                + add account
              </button>
            </div>
          )}

          {activeTab === 'log' && (
            showCalendar
              ? <CalendarPage onClose={() => setShowCalendar(false)} transactions={transactions} />
              : (
            <div className="p-4 space-y-4">
              <h2 className="font-['Press_Start_2P'] text-sm text-[#D2691E] mb-4">Transaction Log</h2>

              {/* Quick Actions */}
              <QuickActions onAddExpense={() => setShowExpenseModal(true)} onAddIncome={() => setShowIncomeModal(true)} />

              {/* AI Chat Bar */}
              <div className="bg-white border-4 border-[#8D6E63] rounded-lg p-3 shadow-[4px_4px_0_0_#6D4C41]">
                <input
                  type="text"
                  placeholder="Tell me what you spent..."
                  className="w-full bg-transparent text-sm text-[#3E2723] placeholder-[#8D6E63] outline-none"
                />
              </div>

              {/* Monthly Summary */}
              <div className="bg-white border-4 border-[#3E2723] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41]">
                <div className="bg-[#64B5F6] px-4 py-2 border-b-4 border-[#8D6E63]">
                  <h3 className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">MAY 2026 SUMMARY</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#FFF9E6] border-3 border-[#8D6E63] rounded-lg p-3 text-center">
                      <p className="font-['Press_Start_2P'] text-[10px] text-[#D32F2F] mb-1">₱{monthlyStats.totalSpent.toLocaleString()}</p>
                      <p className="text-[7px] text-[#6D4C41]">Total Spent</p>
                    </div>
                    <div className="bg-[#FFF9E6] border-3 border-[#8D6E63] rounded-lg p-3 text-center">
                      <p className="font-['Press_Start_2P'] text-[10px] text-[#2E7D32] mb-1">₱{monthlyStats.totalIncome.toLocaleString()}</p>
                      <p className="text-[7px] text-[#6D4C41]">Total Income</p>
                    </div>
                  </div>
                  <div className="bg-[#FFF9E6] border-3 border-[#8D6E63] rounded-lg p-3 text-center">
                    <p className="font-['Press_Start_2P'] text-[10px] text-[#D2691E] mb-1">{monthlyStats.transactionCount}</p>
                    <p className="text-[7px] text-[#6D4C41]">Total Transactions</p>
                  </div>
                  {monthlyStats.topCategory && (
                    <div className="bg-[#FFF9E6] border-3 border-[#8D6E63] rounded-lg p-3">
                      <p className="text-[7px] text-[#6D4C41] mb-2">Top Category This Month</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{monthlyStats.topCategory.emoji}</span>
                          <span className="font-['Press_Start_2P'] text-[8px] text-[#3E2723]">{monthlyStats.topCategory.name}</span>
                        </div>
                        <span className="font-['Press_Start_2P'] text-[8px] text-[#D2691E]">₱{monthlyStats.topCategory.total.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="w-full bg-[#A8D5BA] hover:bg-[#A8D5BA]/80 border-3 border-[#8D6E63] rounded-lg py-2 font-['Press_Start_2P'] text-[8px] text-[#3E2723] shadow-[3px_3px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  >
                    view full calendar
                  </button>
                </div>
              </div>

              {/* Recent Transactions */}
              <RecentTransactions transactions={transactions} />
            </div>
          ))}

          {activeTab === 'farm' && (
            <div className="absolute inset-0 flex flex-col">
              {/* Top Bar */}
              <div className="px-4 py-3 flex items-center justify-between border-b-4 border-[#8D6E63] bg-[#A8D5BA] shadow-[0_4px_0_0_#6B8E7C]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐷</span>
                  <span className="font-['Press_Start_2P'] text-[10px] text-[#3E2723]">PIGGY BANK</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-[#FFD966] px-2 py-1 rounded border-2 border-[#3E2723] shadow-[2px_2px_0_0_#3E2723]">
                    <span className="text-xs">💰</span>
                    <span className="font-['Press_Start_2P'] text-[10px] text-[#3E2723]">{coins}</span>
                  </div>
                  <button className="text-xl">🔔</button>
                </div>
              </div>

              {/* Farm Content with Background */}
              <div className="flex-1 relative overflow-y-auto overflow-x-hidden"
                   style={{
                     backgroundImage: `url(${farmBackground})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center'
                   }}>
                {/* Farm Header */}
                <div className="text-center pt-4 px-4 space-y-3">
                {/* Farm Selector Dropdown */}
                <div className="flex flex-col items-center gap-2">
                  <label className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">SELECT FARM</label>
                  <select
                    value={selectedFarmId}
                    onChange={(e) => setSelectedFarmId(Number(e.target.value))}
                    className="bg-[#FFD966] border-4 border-[#3E2723] rounded-lg px-4 py-2.5 font-['Press_Start_2P'] text-[10px] text-[#3E2723] shadow-[4px_4px_0_0_#6D4C41] focus:outline-none focus:border-[#D2691E] cursor-pointer min-w-[220px]"
                  >
                    {farms.map(farm => (
                      <option key={farm.id} value={farm.id}>
                        {farm.name} {farm.type === 'collaborative' ? '(Team)' : '(Solo)'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Farm Info */}
                <div>
                  {selectedFarm.type === 'collaborative' && selectedFarm.collaborators && (
                    <div className="inline-block bg-[#A8D5BA] border-3 border-[#3E2723] rounded-lg px-3 py-2 mb-2 shadow-[3px_3px_0_0_#6D4C41]">
                      <p className="text-[8px] text-[#6D4C41] mb-1">Collaborators:</p>
                      <p className="font-['Press_Start_2P'] text-[8px] text-[#3E2723]">
                        {selectedFarm.collaborators.join(', ')}
                      </p>
                    </div>
                  )}
                  <div className="inline-block bg-[#FFD966] border-3 border-[#3E2723] rounded-lg px-4 py-2 shadow-[3px_3px_0_0_#6D4C41]">
                    <span className="font-['Press_Start_2P'] text-[10px] text-[#3E2723]">
                      🐷 {selectedFarm.numPigs} Pig{selectedFarm.numPigs !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Farm Scene - Larger */}
              <div className="flex-1 flex items-center justify-center relative px-4 py-6">
                <div className="relative w-full max-w-[450px]">
                  <img
                    src={farmScene}
                    alt="Farm"
                    className="w-full object-contain"
                  />

                  {/* Dynamic Pigs Overlay - positioned over the farm scene */}
                  <div className="absolute inset-0">
                    {Array.from({ length: selectedFarm.numPigs }).map((_, i) => {
                      const positions = [
                        { top: '42%', left: '28%' },
                        { top: '48%', left: '38%' },
                        { top: '45%', left: '48%' },
                        { top: '50%', left: '32%' },
                        { top: '52%', left: '42%' },
                        { top: '47%', left: '52%' },
                        { top: '44%', left: '35%' },
                        { top: '49%', left: '45%' },
                        { top: '46%', left: '30%' },
                        { top: '51%', left: '50%' },
                      ];
                      const pos = positions[i % positions.length];
                      const goal = selectedFarm.pigGoals[i];
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedPigIndex(i)}
                          className="absolute animate-pulse hover:scale-110 transition-transform cursor-pointer"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            animationDuration: `${2 + i * 0.5}s`,
                            transform: 'translateX(-50%) translateY(-50%)'
                          }}
                          title={goal ? `Click to see ${goal.name}` : `Pig #${i + 1}`}
                        >
                          <img
                            src={pigAvatar}
                            alt="Pig"
                            className="w-12 h-12"
                            style={{ imageRendering: 'pixelated' }}
                          />
                          {goal && (
                            <div className="absolute -top-2 -right-2 text-sm">{goal.emoji}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Goals and Savings List */}
              <div className="px-4 pb-24 mt-4 relative z-10">
                <div className="bg-white border-4 border-[#3E2723] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41]">
                  <div className="bg-[#A8D5BA] px-4 py-2 border-b-4 border-[#8D6E63]">
                    <h3 className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">GOALS & SAVINGS</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {selectedFarm.pigGoals.map((goal, i) => {
                      if (!goal) return null;
                      const percentage = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
                      return (
                        <div 
                          key={i} 
                          onClick={() => setSelectedPigIndex(i)}
                          className="bg-[#FFF9E6] hover:bg-[#FFD966]/20 border-3 border-[#8D6E63] rounded-lg p-3 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{goal.emoji}</span>
                              <span className="font-['Press_Start_2P'] text-[8px] text-[#3E2723] truncate">{goal.name}</span>
                            </div>
                            <span className="text-[8px] text-[#6D4C41] shrink-0">
                              ₱{goal.savedAmount.toLocaleString()} / ₱{goal.targetAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-3 bg-[#E8D5B7] rounded border-2 border-[#8D6E63] overflow-hidden">
                            <div 
                              className={`h-full ${goal.color || 'bg-[#81C784]'} transition-all`} 
                              style={{ width: `${percentage}%` }} 
                            />
                          </div>
                          <p className="text-[7px] text-[#6D4C41] mt-1 text-right">
                            {Math.round(percentage)}% complete
                          </p>
                        </div>
                      );
                    })}
                    <button 
                      onClick={() => setShowAddGoalModal(true)}
                      className="w-full bg-[#FFD966] hover:bg-[#FFD966]/80 border-3 border-[#8D6E63] rounded-lg py-2 font-['Press_Start_2P'] text-[8px] text-[#3E2723] shadow-[3px_3px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                    >
                      + add goal
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}

          {activeTab === 'debt' && (
            <div className="p-4 space-y-4">
              <h2 className="font-['Press_Start_2P'] text-sm text-[#D2691E] mb-4">Debt tracker</h2>

              {/* Debt Cards Grid */}
              <div className="space-y-3">
                {debts.map((debt) => (
                  <DebtCard
                    key={debt.id}
                    debt={debt}
                    onClick={() => setSelectedDebt(debt)}
                  />
                ))}
              </div>

              {/* Add Debt Button */}
              <button
                onClick={() => setShowAddDebtModal(true)}
                className="w-full bg-[#A8D5BA] hover:bg-[#A8D5BA]/80 border-4 border-[#3E2723] rounded-lg py-4 font-['Press_Start_2P'] text-xs text-[#3E2723] shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                + DEBT
              </button>
            </div>
          )}

          {activeTab === 'board' && (
            <div className="p-4">
              <h2 className="font-['Press_Start_2P'] text-sm text-[#D2691E] mb-4">Leaderboard</h2>
              <Leaderboard />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-4 space-y-4">
              <h2 className="font-['Press_Start_2P'] text-sm text-[#3E2723] mb-4">PROFILE</h2>

              {/* Profile Card */}
              <div className="bg-[#FFF9E6] border-4 border-[#3E2723] rounded-lg p-4 shadow-[4px_4px_0_0_#6D4C41]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 bg-[#FFB6C1] border-3 border-[#3E2723] rounded-lg flex items-center justify-center">
                    <img src={pigAvatar} alt="Avatar" className="w-12 h-12" style={{ imageRendering: 'pixelated' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-['Press_Start_2P'] text-sm text-[#3E2723]">Shane</h3>
                      <span className="font-['Press_Start_2P'] text-[8px] text-[#3E2723]">lvl. 40</span>
                    </div>
                    <p className="text-[9px] text-[#6D4C41] mb-2">Progress towards lvl. 41</p>
                    <div className="relative h-4 bg-[#E8D5B7] rounded border-2 border-[#3E2723] overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-[#81C784] transition-all" style={{ width: '80%' }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-['Press_Start_2P'] text-[7px] text-[#3E2723]">80%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              {/* Goals & Savings */}
              <div className="bg-white border-4 border-[#3E2723] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41]">
                <div className="bg-[#A8D5BA] px-4 py-2 border-b-4 border-[#8D6E63]">
                  <h3 className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">GOALS & SAVINGS</h3>
                </div>
                <div className="p-4 space-y-3">
                  {selectedFarm.pigGoals.map((goal, i) => {
                    if (!goal) return null;
                    const percentage = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
                    return (
                      <div 
                        key={i} 
                        onClick={() => setSelectedPigIndex(i)}
                        className="bg-[#FFF9E6] hover:bg-[#FFD966]/20 border-3 border-[#8D6E63] rounded-lg p-3 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{goal.emoji}</span>
                            <span className="font-['Press_Start_2P'] text-[8px] text-[#3E2723] truncate">{goal.name}</span>
                          </div>
                          <span className="text-[8px] text-[#6D4C41] shrink-0">
                            ₱{goal.savedAmount.toLocaleString()} / ₱{goal.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-3 bg-[#E8D5B7] rounded border-2 border-[#8D6E63] overflow-hidden">
                          <div 
                            className={`h-full ${goal.color || 'bg-[#81C784]'} transition-all`} 
                            style={{ width: `${percentage}%` }} 
                          />
                        </div>
                        <p className="text-[7px] text-[#6D4C41] mt-1 text-right">
                          {Math.round(percentage)}% complete
                        </p>
                      </div>
                    );
                  })}

                  <button 
                    onClick={() => setShowAddGoalModal(true)}
                    className="w-full bg-[#FFD966] hover:bg-[#FFD966]/80 border-3 border-[#8D6E63] rounded-lg py-2 font-['Press_Start_2P'] text-[8px] text-[#3E2723] shadow-[3px_3px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  >
                    + add goal
                  </button>
                </div>
              </div>

              {/* Settings Section */}
              <div className="bg-white border-4 border-[#3E2723] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41]">
                <div className="bg-[#FFD966] px-4 py-2 border-b-4 border-[#8D6E63]">
                  <h3 className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">SETTINGS</h3>
                </div>

                <div className="divide-y-2 divide-[#E8D5B7]">
                  {/* Notification Settings */}
                  <button className="w-full text-left px-4 py-3 hover:bg-[#FFF9E6] transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🔔</span>
                      <span className="text-[10px] text-[#3E2723]">Notification Settings</span>
                    </div>
                    <span className="text-[#8D6E63] group-hover:text-[#D2691E]">›</span>
                  </button>

                  {/* Audio Settings */}
                  <button className="w-full text-left px-4 py-3 hover:bg-[#FFF9E6] transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🔊</span>
                      <span className="text-[10px] text-[#3E2723]">Audio Settings</span>
                    </div>
                    <span className="text-[#8D6E63] group-hover:text-[#D2691E]">›</span>
                  </button>

                  {/* Account Settings */}
                  <button className="w-full text-left px-4 py-3 hover:bg-[#FFF9E6] transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">⚙️</span>
                      <div className="flex-1">
                        <p className="text-[10px] text-[#3E2723]">Account Settings</p>
                        <p className="text-[8px] text-[#6D4C41]">Restart, delete account</p>
                      </div>
                    </div>
                    <span className="text-[#8D6E63] group-hover:text-[#D2691E]">›</span>
                  </button>

                  {/* About the Creator */}
                  <button className="w-full text-left px-4 py-3 hover:bg-[#FFF9E6] transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">ℹ️</span>
                      <span className="text-[10px] text-[#3E2723]">About the Creator</span>
                    </div>
                    <span className="text-[#8D6E63] group-hover:text-[#D2691E]">›</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#FFD966] border-t-4 border-[#8D6E63] shadow-[0_-4px_0_0_#6D4C41] z-50">
          <div className="flex justify-around items-center py-3 px-2">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'log', icon: PlusCircle, label: 'Log' },
              { id: 'debt', icon: Receipt, label: 'Debt' },
              { id: 'farm', icon: Users, label: 'Farm' },
              { id: 'board', icon: Trophy, label: 'Board' },
              { id: 'profile', icon: User, label: 'Profile' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  activeTab === id ? 'text-[#D2691E]' : 'text-[#6D4C41]'
                }`}
              >
                <Icon size={18} />
                <span className="text-[7px] font-['Press_Start_2P']">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Modal */}
      {showExpenseModal && (
        <ExpenseModal onClose={() => setShowExpenseModal(false)} onSubmit={handleAddExpense} />
      )}

      {/* Income Modal */}
      {showIncomeModal && (
        <IncomeModal onClose={() => setShowIncomeModal(false)} onSubmit={handleAddIncome} />
      )}

      {/* Debt Detail Modal */}
      {selectedDebt && (
        <DebtDetailModal
          debt={selectedDebt}
          onClose={() => setSelectedDebt(null)}
          onAddPayment={() => setShowDebtPaymentModal(true)}
        />
      )}

      {/* Debt Payment Modal */}
      {showDebtPaymentModal && selectedDebt && (
        <DebtPaymentModal
          debtName={selectedDebt.name}
          remainingAmount={selectedDebt.totalAmount - selectedDebt.paidAmount}
          onClose={() => setShowDebtPaymentModal(false)}
          onSubmit={handleAddDebtPayment}
        />
      )}

      {/* Add Debt Modal */}
      {showAddDebtModal && (
        <AddDebtModal
          onClose={() => setShowAddDebtModal(false)}
          onSubmit={handleAddDebt}
        />
      )}

      {/* Debt Completion Modal */}
      {completedDebt && (
        <DebtCompletionModal
          debtName={completedDebt.name}
          debtEmoji={completedDebt.emoji}
          totalAmount={completedDebt.totalAmount}
          onClose={() => setCompletedDebt(null)}
          onRemove={handleRemoveDebt}
        />
      )}

      {/* Pig Goal Modal */}
      {selectedPigIndex !== null && selectedFarm.pigGoals[selectedPigIndex] && (
        <PigGoalModal
          pigNumber={selectedPigIndex + 1}
          goal={selectedFarm.pigGoals[selectedPigIndex]}
          onClose={() => setSelectedPigIndex(null)}
        />
      )}

      {/* Add Wallet Modal */}
      {showAddWalletModal && (
        <AddWalletModal
          onClose={() => setShowAddWalletModal(false)}
          onSubmit={handleAddWallet}
        />
      )}

      {/* Wallet Detail Modal */}
      {selectedWallet && (
        <WalletDetailModal
          walletName={selectedWallet}
          balance={walletBalances[selectedWallet]}
          transactions={transactions}
          style={getWalletStyle(selectedWallet, Object.keys(walletBalances).indexOf(selectedWallet))}
          onClose={() => setSelectedWallet(null)}
        />
      )}

      {/* Add Pig Goal Modal */}
      {showAddGoalModal && (
        <AddPigGoalModal
          onClose={() => setShowAddGoalModal(false)}
          onSubmit={handleAddGoal}
        />
      )}
    </div>
  );
}

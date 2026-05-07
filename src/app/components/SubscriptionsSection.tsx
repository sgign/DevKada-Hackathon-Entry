import { useState } from 'react';
import { CreditCard, Plus, Trash2, Calendar } from 'lucide-react';

interface Subscription {
  id: number;
  name: string;
  amount: number;
  category: string;
  categoryEmoji: string;
  wallet: string;
  billingDay: number;
}

interface SubscriptionsSectionProps {
  subscriptions: Subscription[];
  onAddSubscription: () => void;
  onDeleteSubscription: (id: number) => void;
}

export function SubscriptionsSection({ 
  subscriptions, 
  onAddSubscription, 
  onDeleteSubscription 
}: SubscriptionsSectionProps) {
  return (
    <div className="bg-white border-4 border-[#3E2723] rounded-lg overflow-hidden shadow-[4px_4px_0_0_#6D4C41]">
      <div className="bg-[#CE93D8] px-4 py-2 border-b-4 border-[#8D6E63] flex justify-between items-center">
        <h3 className="font-['Press_Start_2P'] text-[9px] text-[#3E2723]">AUTO-SUBSCRIPTIONS</h3>
        <button 
          onClick={onAddSubscription}
          className="bg-white/50 hover:bg-white/80 p-1 rounded border-2 border-[#3E2723] transition-colors"
        >
          <Plus size={14} className="text-[#3E2723]" />
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        {subscriptions.length === 0 ? (
          <p className="text-[8px] text-[#6D4C41] text-center italic py-4">No active subscriptions</p>
        ) : (
          subscriptions.map(sub => (
            <div key={sub.id} className="bg-[#FFF9E6] border-3 border-[#8D6E63] rounded-lg p-3 group relative">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{sub.categoryEmoji}</span>
                  <div>
                    <p className="font-['Press_Start_2P'] text-[8px] text-[#3E2723]">{sub.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[7px] px-1.5 py-0.5 bg-[#A8D5BA] text-[#3E2723] rounded border border-[#6B8E7C]">
                        {sub.wallet}
                      </span>
                      <span className="text-[7px] text-[#6D4C41] flex items-center gap-1">
                        <Calendar size={10} /> Day {sub.billingDay}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <p className="font-['Press_Start_2P'] text-[9px] text-[#D32F2F]">₱{sub.amount}</p>
                  <button 
                    onClick={() => onDeleteSubscription(sub.id)}
                    className="p-1 hover:bg-red-100 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        
        <p className="text-[7px] text-[#6D4C41] leading-relaxed mt-2 text-center">
          *Subscriptions are automatically logged as expenses every month on their billing day.
        </p>
      </div>
    </div>
  );
}

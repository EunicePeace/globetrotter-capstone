import React, { useState } from 'react';
import { Wallet, Plus, DollarSign, PieChart, TrendingUp, Trash2, ArrowUpRight } from 'lucide-react';
import { Expense } from '../types';

interface BudgetPlannerProps {
  currency: 'XAF' | 'USD';
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onRemoveExpense: (expenseId: string) => void;
}

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({
  currency,
  expenses,
  onAddExpense,
  onRemoveExpense
}) => {
  const [totalBudgetXAF, setTotalBudgetXAF] = useState<number>(50000); // Default 50,000 FCFA
  const [description, setDescription] = useState('');
  const [amountXAF, setAmountXAF] = useState<number>(1500);
  const [category, setCategory] = useState<Expense['category']>('transport');

  const totalSpentXAF = expenses.reduce((acc, curr) => acc + curr.amountXAF, 0);
  const remainingXAF = totalBudgetXAF - totalSpentXAF;
  const percentageSpent = Math.min(100, Math.round((totalSpentXAF / totalBudgetXAF) * 100));

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amountXAF <= 0) return;

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      category,
      description: description.trim(),
      amountXAF,
      date: new Date().toLocaleDateString()
    };

    onAddExpense(newExp);
    setDescription('');
    setAmountXAF(1500);
  };

  const formatPrice = (valXAF: number) => {
    return currency === 'XAF'
      ? `${valXAF.toLocaleString()} FCFA`
      : `$${(valXAF / 606).toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      {/* Budget Summary Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Travel Budget</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{formatPrice(totalBudgetXAF)}</span>
            <button
              onClick={() => {
                const newB = prompt('Set new target budget in FCFA:', totalBudgetXAF.toString());
                if (newB && !isNaN(Number(newB))) setTotalBudgetXAF(Number(newB));
              }}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Edit Target
            </button>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Expenses Logged</span>
          <span className="text-2xl font-extrabold text-amber-700">{formatPrice(totalSpentXAF)}</span>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1">Remaining Balance</span>
          <span className={`text-2xl font-extrabold ${remainingXAF >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {formatPrice(remainingXAF)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-700">Budget Usage</span>
          <span className={percentageSpent > 90 ? 'text-rose-600' : 'text-emerald-700'}>{percentageSpent}% Spent</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className={`h-full transition-all duration-500 ${
              percentageSpent > 90 ? 'bg-rose-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${percentageSpent}%` }}
          />
        </div>
      </div>

      {/* Main Form & Expense History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Add Expense Form */}
        <div className="md:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-blue-600" />
            Add Travel Expense
          </h3>

          <form onSubmit={handleCreateExpense} className="space-y-2.5 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Yellow Taxi fare to Bastos, Entry Ticket..."
                className="w-full bg-slate-50 text-slate-900 rounded-md px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Amount (FCFA)</label>
                <input
                  type="number"
                  value={amountXAF}
                  onChange={(e) => setAmountXAF(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-900 rounded-md px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Category</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 rounded-md px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:border-blue-600"
                >
                  <option value="transport">🚗 Transport</option>
                  <option value="entrance">🎟 Entrance Ticket</option>
                  <option value="food">🍲 Food & Dining</option>
                  <option value="souvenirs">🛍 Souvenirs</option>
                  <option value="lodging">🏨 Lodging</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              Log Expense
            </button>
          </form>
        </div>

        {/* Expenses List */}
        <div className="md:col-span-7 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-blue-600" />
            Logged Expenses History
          </h3>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {expenses.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No expenses logged yet. Add your taxi or entrance ticket costs above!</p>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{exp.description}</span>
                    <span className="text-[10px] text-slate-500 capitalize">{exp.category} • {exp.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-blue-700">{formatPrice(exp.amountXAF)}</span>
                    <button
                      onClick={() => onRemoveExpense(exp.id)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

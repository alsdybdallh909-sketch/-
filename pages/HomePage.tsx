import React from 'react';
import Page from '../components/Page';
import Icon from '../components/Icon';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Invoice, Expense } from '../types';

const SummaryCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-surface p-4 rounded-xl shadow-sm flex items-center space-x-4 space-x-reverse">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-text-secondary text-sm">{title}</p>
      <p className="text-xl font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const [invoices] = useLocalStorage<Invoice[]>('invoices', []);
  const [expenses] = useLocalStorage<Expense[]>('expenses', []);
  const [settings] = useLocalStorage('settings', { currency: 'ر.س' });

  const today = new Date().toISOString().split('T')[0];

  const todaysSales = invoices
    .filter(inv => inv.date === today && inv.status !== 'مسودة')
    .reduce((sum, inv) => sum + inv.total, 0);

  const todaysExpenses = expenses
    .filter(exp => exp.date === today)
    .reduce((sum, exp) => sum + exp.amount, 0);
  
  const totalRevenue = invoices
    .filter(inv => inv.status !== 'مسودة')
    .reduce((sum, inv) => sum + inv.total, 0);
    
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const netProfit = totalRevenue - totalExpenses;

  const recentTransactions = [
      ...invoices.filter(inv => inv.status !== 'مسودة').map(inv => ({
          id: inv.id,
          date: inv.date,
          description: `فاتورة #${inv.serialNumber}`,
          secondaryText: inv.customerName,
          amount: inv.total,
          isPositive: true,
      })),
      ...expenses.map(exp => ({
          id: exp.id,
          date: exp.date,
          description: exp.description,
          secondaryText: exp.category,
          amount: exp.amount,
          isPositive: false,
      })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <Page title="الرئيسية">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="bg-primary text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center text-lg hover:bg-primary-dark transition-colors shadow-md">
            <Icon name="barcode" className="w-6 h-6 me-3" />
            <span>مسح باركود</span>
          </button>
           <div className="relative">
            <input type="text" placeholder="بحث سريع عن منتج..." className="w-full bg-surface py-4 px-6 pe-12 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" />
            <div className="absolute top-1/2 -translate-y-1/2 start-4 text-text-secondary">
               <Icon name="search" className="w-5 h-5"/>
            </div>
           </div>
        </div>

        {/* Financial Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryCard 
            title="مبيعات اليوم" 
            value={`${todaysSales.toFixed(2)} ${settings.currency}`} 
            icon={<Icon name="transactions" className="w-6 h-6 text-white"/>}
            color="bg-green-500"
          />
          <SummaryCard 
            title="مصروفات اليوم" 
            value={`${todaysExpenses.toFixed(2)} ${settings.currency}`} 
            icon={<Icon name="transactions" className="w-6 h-6 text-white"/>}
            color="bg-red-500"
          />
          <SummaryCard 
            title="صافي الربح (الإجمالي)" 
            value={`${netProfit.toFixed(2)} ${settings.currency}`} 
            icon={<Icon name="data" className="w-6 h-6 text-white"/>}
            color="bg-blue-500"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-text-primary mb-4">أحدث العمليات</h2>
          <div className="bg-surface rounded-xl shadow-sm">
             {recentTransactions.length === 0 ? (
               <p className="text-center text-text-secondary py-8 px-4">لا توجد عمليات مسجلة بعد.</p>
             ) : (
                <ul className="divide-y divide-slate-100">
                  {recentTransactions.map(tx => (
                    <li key={tx.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{tx.description}</p>
                        <p className="text-sm text-text-secondary">{tx.secondaryText}</p>
                      </div>
                      <p className={`font-bold text-lg ${tx.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.isPositive ? '+' : '-'}{tx.amount.toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
             )}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default HomePage;
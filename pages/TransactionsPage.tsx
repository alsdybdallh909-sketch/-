import React, { useState } from 'react';
import Page from '../components/Page';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Invoice, Expense, InvoiceStatus, Customer, Product, InvoiceItem } from '../types';

type TransactionView = 'invoices' | 'expenses';

const TransactionsPage: React.FC = () => {
  const [view, setView] = useState<TransactionView>('invoices');
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleDeleteInvoice = (id: string) => {
      if (window.confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
          setInvoices(prev => prev.filter(inv => inv.id !== id));
      }
  }

  const handleDeleteExpense = (id: string) => {
      if (window.confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
          setExpenses(prev => prev.filter(exp => exp.id !== id));
      }
  }
  
  const handleAddInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
    setIsModalOpen(false);
  };
  
  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
    setIsModalOpen(false);
  };

  const renderInvoices = () => (
    <div className="space-y-3">
      {invoices.length > 0 ? invoices.map(inv => (
        <div key={inv.id} className="bg-surface p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold">فاتورة #{inv.serialNumber}</p>
              <p className="text-sm text-text-secondary">{inv.customerName} - {inv.date}</p>
            </div>
            <div className="text-start flex flex-col items-end">
              <p className="font-bold text-lg text-green-600">{inv.total.toFixed(2)} ر.س</p>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full mt-1">{inv.status}</span>
            </div>
          </div>
           <div className="flex justify-end mt-2">
                <button onClick={() => handleDeleteInvoice(inv.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Icon name="trash" className="w-5 h-5"/></button>
            </div>
        </div>
      )) : <p className="text-center text-text-secondary py-8">لا توجد فواتير.</p>}
    </div>
  );

  const renderExpenses = () => (
     <div className="space-y-3">
      {expenses.length > 0 ? expenses.map(exp => (
        <div key={exp.id} className="bg-surface p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold">{exp.description}</p>
              <p className="text-sm text-text-secondary">{exp.category} - {exp.date}</p>
            </div>
            <p className="font-bold text-lg text-red-600">{exp.amount.toFixed(2)} ر.س</p>
          </div>
            <div className="flex justify-end mt-2">
                <button onClick={() => handleDeleteExpense(exp.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Icon name="trash" className="w-5 h-5"/></button>
            </div>
        </div>
      )) : <p className="text-center text-text-secondary py-8">لا توجد مصاريف.</p>}
    </div>
  );
  
  return (
    <Page 
      title="العمليات"
      action={
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-primary-dark transition-colors">
          <Icon name="plus" className="w-5 h-5 me-2" />
          <span>{view === 'invoices' ? 'إضافة فاتورة' : 'إضافة مصروف'}</span>
        </button>
      }
    >
      {view === 'invoices' ? (
        <InvoiceFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddInvoice} />
      ) : (
        <ExpenseFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddExpense} />
      )}

      <div className="mb-4">
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => setView('invoices')} 
            className={`flex-1 p-2 rounded-md font-semibold transition-colors ${view === 'invoices' ? 'bg-surface shadow' : 'text-text-secondary'}`}
          >
            الفواتير
          </button>
          <button 
            onClick={() => setView('expenses')} 
            className={`flex-1 p-2 rounded-md font-semibold transition-colors ${view === 'expenses' ? 'bg-surface shadow' : 'text-text-secondary'}`}
          >
            المصاريف
          </button>
        </div>
      </div>
      
      {view === 'invoices' ? renderInvoices() : renderExpenses()}
    </Page>
  );
};

const ExpenseFormModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (expense: Expense) => void}> = ({isOpen, onClose, onSave}) => {
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState('مصاريف عامة');

    const handleSubmit = () => {
        if(!desc || amount <= 0) {
            alert('يرجى إدخال وصف ومبلغ صحيح');
            return;
        }
        onSave({
            id: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0],
            description: desc,
            amount,
            category
        });
        setDesc('');
        setAmount(0);
        setCategory('مصاريف عامة');
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="إضافة مصروف جديد">
            <div className="space-y-4">
                <input type="text" placeholder="الوصف" value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 border rounded" />
                <input type="number" placeholder="المبلغ" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 border rounded" />
                <input type="text" placeholder="الفئة" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded" />
            </div>
             <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded">إلغاء</button>
                <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded">إضافة</button>
            </div>
        </Modal>
    )
}

// A simplified Invoice form for now
const InvoiceFormModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (invoice: Invoice) => void}> = ({isOpen, onClose, onSave}) => {
    const [customers] = useLocalStorage<Customer[]>('customers', []);
    const [customerId, setCustomerId] = useState('');
    
    const handleSubmit = () => {
        const customer = customers.find(c => c.id === customerId);
        if(!customer) {
            alert('يرجى اختيار عميل');
            return;
        }
        // Simplified invoice with no items for this example
        const total = 0;
        const tax = 0;
        onSave({
            id: new Date().toISOString(),
            serialNumber: `INV-${Date.now().toString().slice(-6)}`,
            customerId: customer.id,
            customerName: customer.name,
            date: new Date().toISOString().split('T')[0],
            items: [],
            subtotal: total,
            tax,
            total: total + tax,
            status: InvoiceStatus.Draft
        });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="إضافة فاتورة جديدة">
            <div className="space-y-4">
                <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="w-full p-2 border rounded bg-white">
                    <option value="">اختر عميل...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <p className="text-sm text-text-secondary">ملاحظة: إنشاء الفواتير التفصيلي قيد التطوير. حالياً، سيتم إنشاء فاتورة مسودة.</p>
            </div>
             <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded">إلغاء</button>
                <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded">إنشاء فاتورة</button>
            </div>
        </Modal>
    )
}

export default TransactionsPage;
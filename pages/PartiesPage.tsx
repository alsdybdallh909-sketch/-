import React, { useState } from 'react';
import Page from '../components/Page';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Customer, Supplier } from '../types';

type PartyView = 'customers' | 'suppliers';
type Party = Customer | Supplier;

const emptyCustomer: Omit<Customer, 'id'> = { name: '', phone: '', email: '', address: '', taxNumber: ''};
const emptySupplier: Omit<Supplier, 'id'> = { name: '', phone: '', email: '', address: '', taxNumber: ''};

const PartiesPage: React.FC = () => {
  const [view, setView] = useState<PartyView>('customers');
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', []);
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('suppliers', []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partyToEdit, setPartyToEdit] = useState<Party | null>(null);

  const openAddModal = () => {
    setPartyToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (party: Party) => {
    setPartyToEdit(party);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    const confirmationText = view === 'customers' 
      ? 'هل أنت متأكد من حذف هذا العميل؟'
      : 'هل أنت متأكد من حذف هذا المورد؟';
    if(window.confirm(confirmationText)) {
      if(view === 'customers') {
        setCustomers(prev => prev.filter(c => c.id !== id));
      } else {
        setSuppliers(prev => prev.filter(s => s.id !== id));
      }
    }
  }

  const handleSave = (party: Party) => {
    if (view === 'customers') {
        setCustomers(prev => partyToEdit ? prev.map(c => c.id === party.id ? party as Customer : c) : [...prev, party as Customer]);
    } else {
        setSuppliers(prev => partyToEdit ? prev.map(s => s.id === party.id ? party as Supplier : s) : [...prev, party as Supplier]);
    }
    setIsModalOpen(false);
  }

  const PartyForm: React.FC<{party: Party | null, type: PartyView, onSave: (party: Party) => void, onCancel: () => void}> = ({ party, type, onSave, onCancel }) => {
    const emptyState = type === 'customers' ? emptyCustomer : emptySupplier;
    const [formData, setFormData] = useState(party ? {...party} : {...emptyState, id: new Date().toISOString()});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name) {
        alert('الرجاء إدخال الاسم.');
        return;
      }
      onSave(formData);
    }

    return (
       <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="الاسم" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="tel" name="phone" placeholder="رقم الهاتف" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="address" placeholder="العنوان" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" />
          <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
              <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300 transition-colors">إلغاء</button>
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">حفظ</button>
          </div>
       </form>
    );
  }

  const renderList = (items: Party[]) => (
    <div className="bg-surface rounded-xl shadow-sm overflow-hidden">
        {items.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {items.map(item => (
              <li key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-text-primary">{item.name}</p>
                  <p className="text-sm text-text-secondary">{item.phone}</p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                    <button onClick={() => openEditModal(item)} className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"><Icon name="pencil" className="w-5 h-5"/></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Icon name="trash" className="w-5 h-5"/></button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16 px-4">
            <Icon name="parties" className="w-16 h-16 mx-auto text-slate-300" />
            <p className="mt-4 text-text-secondary">لا يوجد {view === 'customers' ? 'عملاء' : 'موردون'} بعد. قم بإضافة جهة جديدة.</p>
          </div>
        )}
    </div>
  );

  return (
    <Page
      title="الأطراف"
      action={
        <button onClick={openAddModal} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-primary-dark transition-colors">
          <Icon name="plus" className="w-5 h-5 me-2" />
          <span>{view === 'customers' ? 'إضافة عميل' : 'إضافة مورد'}</span>
        </button>
      }
    >
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={partyToEdit ? (view === 'customers' ? 'تعديل عميل' : 'تعديل مورد') : (view === 'customers' ? 'إضافة عميل' : 'إضافة مورد')}
      >
        <PartyForm party={partyToEdit} type={view} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <div className="mb-4">
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => setView('customers')} 
            className={`flex-1 p-2 rounded-md font-semibold transition-colors ${view === 'customers' ? 'bg-surface shadow' : 'text-text-secondary'}`}
          >
            العملاء
          </button>
          <button 
            onClick={() => setView('suppliers')} 
            className={`flex-1 p-2 rounded-md font-semibold transition-colors ${view === 'suppliers' ? 'bg-surface shadow' : 'text-text-secondary'}`}
          >
            الموردون
          </button>
        </div>
      </div>
      
      {view === 'customers' ? renderList(customers) : renderList(suppliers)}
    </Page>
  );
};

export default PartiesPage;
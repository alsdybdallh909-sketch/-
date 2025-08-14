import React, { useRef, useState, useEffect } from 'react';
import Page from '../components/Page';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AppSettings, Product, Invoice, Expense, Customer, Supplier } from '../types';

const DataPage: React.FC = () => {
  const [storedSettings, setStoredSettings] = useLocalStorage<AppSettings>('settings', {
    businessName: 'نشاطي التجاري',
    businessAddress: 'العنوان',
    currency: 'ر.س',
    taxRate: 15,
    isTaxEnabled: true
  });
  
  const [settings, setSettings] = useState(storedSettings);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const [products] = useLocalStorage<Product[]>('products', []);
  const [invoices] = useLocalStorage<Invoice[]>('invoices', []);
  const [expenses] = useLocalStorage<Expense[]>('expenses', []);
  const [customers] = useLocalStorage<Customer[]>('customers', []);
  const [suppliers] = useLocalStorage<Supplier[]>('suppliers', []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      setSettings(storedSettings);
  }, [storedSettings]);

  const handleSettingsSave = () => {
      setStoredSettings(settings);
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 2000);
  }

  const handleBackup = () => {
    const dataToBackup = {
      settings: storedSettings,
      products,
      invoices,
      expenses,
      customers,
      suppliers,
      backupDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(dataToBackup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${settings.businessName.replace(/\s/g, '_')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('تم إنشاء ملف النسخ الاحتياطي بنجاح!');
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm("تحذير: سيتم استبدال جميع البيانات الحالية بالبيانات الموجودة في ملف النسخة الاحتياطية. هل أنت متأكد من المتابعة؟")) {
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File content is not a string");
        const restoredData = JSON.parse(text);
        
        // A real app would need more validation (e.g., using Zod).
        if(restoredData.settings) localStorage.setItem('settings', JSON.stringify(restoredData.settings));
        if(restoredData.products) localStorage.setItem('products', JSON.stringify(restoredData.products));
        if(restoredData.invoices) localStorage.setItem('invoices', JSON.stringify(restoredData.invoices));
        if(restoredData.expenses) localStorage.setItem('expenses', JSON.stringify(restoredData.expenses));
        if(restoredData.customers) localStorage.setItem('customers', JSON.stringify(restoredData.customers));
        if(restoredData.suppliers) localStorage.setItem('suppliers', JSON.stringify(restoredData.suppliers));

        alert('تم استعادة البيانات بنجاح! سيتم إعادة تحميل التطبيق الآن.');
        window.location.reload();
      } catch (error) {
        console.error("Failed to restore data:", error);
        alert('فشل في استعادة البيانات. الملف قد يكون تالفًا أو غير متوافق.');
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };
  
  const MenuItem: React.FC<{ title: string, description: string, onClick?: () => void, isButton?: boolean }> = ({ title, description, onClick, isButton = true }) => (
    <div onClick={onClick} className={`w-full text-start p-4 bg-surface rounded-lg shadow-sm ${isButton ? 'hover:bg-slate-50 transition-colors cursor-pointer' : ''}`}>
      <h3 className="font-bold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  );

  const IncomeStatement = () => {
      const totalRevenue = invoices
        .filter(inv => inv.status !== 'مسودة')
        .reduce((sum, inv) => sum + inv.total, 0);

      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const netProfit = totalRevenue - totalExpenses;

      return (
        <div className="bg-surface p-4 rounded-lg shadow-sm space-y-4">
            <h3 className="font-bold text-text-primary text-lg border-b pb-2">قائمة الدخل (ملخص)</h3>
            <div className="flex justify-between items-center">
                <p>إجمالي الإيرادات (الفواتير)</p>
                <p className="font-bold text-green-600">{totalRevenue.toFixed(2)} {settings.currency}</p>
            </div>
            <div className="flex justify-between items-center">
                <p>إجمالي المصروفات</p>
                <p className="font-bold text-red-600">{totalExpenses.toFixed(2)} {settings.currency}</p>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
                <p className="font-bold text-lg">صافي الربح</p>
                <p className={`font-bold text-lg ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{netProfit.toFixed(2)} {settings.currency}</p>
            </div>
        </div>
      );
  }

  return (
    <Page title="البيانات والإعدادات">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-3 text-text-primary">التقارير المالية</h2>
          <div className="space-y-4">
            <IncomeStatement />
            <MenuItem title="الميزانية العمومية" description="عرض الأصول والخصوم وحقوق الملكية (قيد التطوير)" isButton={false}/>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-text-primary">إدارة البيانات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             <MenuItem title="نسخ احتياطي للبيانات" description="حفظ نسخة من جميع بياناتك في ملف" onClick={handleBackup} />
             <MenuItem title="استعادة البيانات" description="استيراد البيانات من ملف نسخة احتياطية" onClick={handleRestoreClick} />
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json"/>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-3 text-text-primary">الإعدادات العامة</h2>
          <div className="bg-surface p-4 rounded-lg shadow-sm space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary">اسم النشاط التجاري</label>
                <input type="text" value={settings.businessName} onChange={e => setSettings(s => ({...s, businessName: e.target.value}))} className="mt-1 w-full p-2 border rounded-md"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-text-secondary">العملة</label>
                <input type="text" value={settings.currency} onChange={e => setSettings(s => ({...s, currency: e.target.value}))} className="mt-1 w-full p-2 border rounded-md" placeholder='e.g. ر.س'/>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center">
                    <input type="checkbox" id="tax-enabled" checked={settings.isTaxEnabled} onChange={e => setSettings(s => ({...s, isTaxEnabled: e.target.checked}))} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                    <label htmlFor="tax-enabled" className="ms-2 block text-sm text-gray-900">تفعيل الضريبة</label>
                </div>
                {settings.isTaxEnabled && (
                     <div>
                        <label className="block text-sm font-medium text-text-secondary">نسبة الضريبة (%)</label>
                        <input type="number" value={settings.taxRate} onChange={e => setSettings(s => ({...s, taxRate: Number(e.target.value)}))} className="mt-1 w-full p-2 border rounded-md"/>
                    </div>
                )}
            </div>
            <div className="border-t pt-4 flex justify-end items-center space-x-4 space-x-reverse">
                 {showSaveConfirmation && <p className="text-green-600 text-sm">تم الحفظ بنجاح!</p>}
                <button onClick={handleSettingsSave} className="px-5 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                    حفظ الإعدادات
                </button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default DataPage;
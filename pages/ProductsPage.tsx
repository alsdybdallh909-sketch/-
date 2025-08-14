import React, { useState } from 'react';
import Page from '../components/Page';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product } from '../types';

const emptyProduct: Omit<Product, 'id'> = {
  name: '', sku: '', purchasePrice: 0, salePrice: 0, quantity: 0, reorderPoint: 0
};

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const ProductForm: React.FC<{product: Product | null, onSave: (product: Product) => void, onCancel: () => void}> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState(product ? {...product} : {...emptyProduct, id: new Date().toISOString()});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type } = e.target;
      setFormData(prev => ({...prev, [name]: type === 'number' ? Number(value) : value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.sku || formData.salePrice <= 0) {
        alert('الرجاء إدخال اسم المنتج، رقم المنتج، وسعر البيع.');
        return;
      }
      onSave(formData as Product);
    }
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="اسم المنتج" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required/>
        <input type="text" name="sku" placeholder="رقم المنتج (SKU)" value={formData.sku} onChange={handleChange} className="w-full p-2 border rounded" required/>
        <input type="number" step="0.01" name="salePrice" placeholder="سعر البيع" value={formData.salePrice} onChange={handleChange} className="w-full p-2 border rounded" required/>
        <input type="number" name="purchasePrice" placeholder="سعر الشراء" value={formData.purchasePrice} onChange={handleChange} className="w-full p-2 border rounded"/>
        <input type="number" name="quantity" placeholder="الكمية الحالية" value={formData.quantity} onChange={handleChange} className="w-full p-2 border rounded"/>
        <input type="number" name="reorderPoint" placeholder="حد إعادة الطلب" value={formData.reorderPoint} onChange={handleChange} className="w-full p-2 border rounded"/>
         <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300 transition-colors">إلغاء</button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">حفظ</button>
        </div>
      </form>
    );
  }

  const handleSaveProduct = (product: Product) => {
    if (productToEdit) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [...prev, product]);
    }
    setIsModalOpen(false);
  }

  return (
    <Page 
      title="المنتجات"
      action={
        <button onClick={openAddModal} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-primary-dark transition-colors">
          <Icon name="plus" className="w-5 h-5 me-2" />
          إضافة منتج
        </button>
      }
    >
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={productToEdit ? "تعديل منتج" : "إضافة منتج جديد"}>
         <ProductForm product={productToEdit} onSave={handleSaveProduct} onCancel={() => setIsModalOpen(false)}/>
      </Modal>

      <div className="mb-4 relative">
        <input 
          type="text" 
          placeholder="ابحث بالاسم أو رقم المنتج..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-3 pe-10 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
        />
        <Icon name="search" className="absolute top-1/2 -translate-y-1/2 start-3 text-slate-400" />
      </div>

      <div className="bg-surface rounded-xl shadow-sm overflow-hidden">
        {filteredProducts.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {filteredProducts.map(product => (
              <li key={product.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                <div className="flex-1">
                  <p className="font-semibold text-text-primary">{product.name}</p>
                  <p className="text-sm text-text-secondary">SKU: {product.sku}</p>
                </div>
                <div className="flex-1 text-start">
                  <p className="font-bold text-primary">{product.salePrice.toFixed(2)} ر.س</p>
                  <p className="text-sm text-text-secondary">الكمية: {product.quantity}</p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                   <button onClick={() => openEditModal(product)} className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"><Icon name="pencil" className="w-5 h-5"/></button>
                   <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Icon name="trash" className="w-5 h-5"/></button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16 px-4">
            <Icon name="products" className="w-16 h-16 mx-auto text-slate-300" />
            <p className="mt-4 text-text-secondary">{searchTerm ? `لا توجد نتائج بحث لـ "${searchTerm}"` : 'لا توجد منتجات. قم بإضافة منتج جديد للبدء.'}</p>
          </div>
        )}
      </div>
    </Page>
  );
};

export default ProductsPage;

export enum AppSection {
  Home = 'home',
  Products = 'products',
  Transactions = 'transactions',
  Parties = 'parties',
  Data = 'data',
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  reorderPoint: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  taxNumber?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  taxNumber?: string;
}

export enum InvoiceStatus {
  Draft = 'مسودة',
  Unpaid = 'غير مدفوعة',
  PartiallyPaid = 'مدفوعة جزئياً',
  Paid = 'مدفوعة بالكامل',
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  serialNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface AppSettings {
  businessName: string;
  businessAddress: string;
  currency: string;
  taxRate: number;
  isTaxEnabled: boolean;
}


import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import TransactionsPage from './pages/TransactionsPage';
import PartiesPage from './pages/PartiesPage';
import DataPage from './pages/DataPage';

const AppLayout: React.FC = () => {
  return (
    <div className="font-sans bg-background text-text-primary">
      <div className="pb-16">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="parties" element={<PartiesPage />} />
          <Route path="data" element={<DataPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;

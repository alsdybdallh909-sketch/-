
import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppSection } from '../types';
import Icon from './Icon';

const navItems = [
  { to: '/', label: 'الرئيسية', icon: AppSection.Home },
  { to: '/products', label: 'المنتجات', icon: AppSection.Products },
  { to: '/transactions', label: 'العمليات', icon: AppSection.Transactions },
  { to: '/parties', label: 'الأطراف', icon: AppSection.Parties },
  { to: '/data', label: 'البيانات', icon: AppSection.Data },
];

const BottomNav: React.FC = () => {
  const baseClasses = "flex flex-col items-center justify-center flex-1 p-2 text-center transition-colors duration-200";
  const inactiveClasses = "text-text-secondary hover:text-primary";
  const activeClasses = "text-primary scale-105";

  return (
    <nav className="fixed bottom-0 start-0 end-0 h-16 bg-surface shadow-[0_-2px_5px_rgba(0,0,0,0.05)] flex border-t border-slate-200">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
          <Icon name={item.icon} className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;

import React, { useEffect } from 'react';
import Icon from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-surface rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all animate-fade-in-up" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 id="modal-title" className="text-xl font-bold text-text-primary">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="إغلاق"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <footer className="flex justify-end p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl space-x-2 space-x-reverse">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

export default Modal;

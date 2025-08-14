
import React from 'react';

interface PageProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children, action }) => {
  return (
    <div className="p-4 sm:p-6 bg-background min-h-screen pb-20">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
        {action && <div>{action}</div>}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Page;

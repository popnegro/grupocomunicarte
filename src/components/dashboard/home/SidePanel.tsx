import React from 'react';

interface SidePanelProps {
  children: React.ReactNode;
}

export const SidePanel: React.FC<SidePanelProps> = ({ children }) => {
  return (
    <div className="lg:col-span-4 space-y-6 text-left">
      {children}
    </div>
  );
};

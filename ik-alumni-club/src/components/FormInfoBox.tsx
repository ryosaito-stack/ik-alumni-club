'use client';

import { ReactNode } from 'react';

interface FormInfoBoxProps {
  children: ReactNode;
  variant?: 'info' | 'warning' | 'success';
}

export default function FormInfoBox({ children, variant = 'info' }: FormInfoBoxProps) {
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    success: 'bg-green-50 border-green-200 text-green-700'
  };

  return (
    <div className={`border rounded-lg p-4 text-sm ${variantClasses[variant]}`}>
      {children}
    </div>
  );
}
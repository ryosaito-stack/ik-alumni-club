'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface SectionProps {
  id?: string;
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
  bgColor?: 'white' | 'gray';
  children: ReactNode;
  className?: string;
}

export default function Section({
  id,
  title,
  viewAllLink,
  viewAllText = 'VIEW ALL',
  bgColor = 'white',
  children,
  className = ''
}: SectionProps) {
  const bgClass = bgColor === 'gray' ? 'bg-gray-50' : 'bg-white';
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id={id} className={`${bgClass} ${className}`} ref={ref} style={{ marginBottom: '150px' }}>
      <div className="mx-auto" style={{ padding: '0 5%' }}>
        <div className={`flex justify-between items-center ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`} style={{ marginBottom: '60px' }}>
          <h2 className="font-bold tracking-wider font-3d" style={{ fontSize: '40px' }}>{title}</h2>
          {viewAllLink && (
            <Link 
              href={viewAllLink} 
              className="text-black hover:text-gray-700 font-3d text-sm md:text-base transition-all duration-300 hover:scale-105"
            >
              {viewAllText}
            </Link>
          )}
        </div>
        <div className={`${isVisible ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'}`}>
          {children}
        </div>
      </div>
    </section>
  );
}
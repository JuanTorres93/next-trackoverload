import { ReactNode } from 'react';

interface SectionHeadingProps {
  children: ReactNode;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function SectionHeading({
  children,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`mb-12 ${alignClasses[align]} ${className}`}>
      <h2 className="text-4xl font-bold leading-tight md:text-5xl text-text">
        {children}
      </h2>
      {subtitle && (
        <>
          <div className="w-20 h-1 mx-auto mt-6 rounded-full bg-gradient-to-r from-primary to-primary-light" />
          <p className="max-w-2xl mx-auto mt-6 text-lg text-text-minor-emphasis">
            {subtitle}
          </p>
        </>
      )}
    </div>
  );
}

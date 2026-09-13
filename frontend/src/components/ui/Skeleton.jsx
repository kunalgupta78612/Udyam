import React from 'react';

export default function Skeleton({
  variant = 'text', // 'text' | 'rectangular' | 'circular'
  width,
  height,
  className = '',
  style = {},
}) {
  const getDefaultHeight = () => {
    if (height) return height;
    if (variant === 'text') return '1rem';
    if (variant === 'circular') return width || '3rem';
    return '6rem';
  };

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={{
        width: width || (variant === 'circular' ? getDefaultHeight() : '100%'),
        height: getDefaultHeight(),
        borderRadius: variant === 'circular' ? '50%' : variant === 'text' ? 'var(--radius-sm)' : 'var(--radius-md)',
        backgroundColor: 'var(--color-border-light)',
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style,
      }}
    />
  );
}

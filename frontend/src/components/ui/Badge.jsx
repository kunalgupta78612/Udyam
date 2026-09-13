import React from 'react';

export default function Badge({
  children,
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'accent' | 'neutral'
  size = 'md', // 'sm' | 'md'
  icon: Icon,
  className = '',
  pill = false,
  ...props
}) {
  return (
    <span
      className={`badge badge-${variant} badge-${size} ${pill ? 'badge-pill' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : 14} style={{ marginRight: '0.3rem', display: 'inline-block', verticalAlign: '-1px' }} />}
      {children}
    </span>
  );
}

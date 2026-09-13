import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const baseClasses = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-block' : ''} ${className}`;

  return (
    <button
      type={type}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="spinner" style={{ width: '1.1rem', height: '1.1rem', marginRight: children ? '0.5rem' : 0 }} />
      ) : Icon && iconPosition === 'left' ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} style={{ marginRight: '0.4rem', display: 'inline-block', verticalAlign: 'middle' }} />
      ) : null}

      <span>{children}</span>

      {!loading && Icon && iconPosition === 'right' ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} style={{ marginLeft: '0.4rem', display: 'inline-block', verticalAlign: 'middle' }} />
      ) : null}
    </button>
  );
}

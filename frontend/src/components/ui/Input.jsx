import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon: Icon,
  rightElement,
  required = false,
  className = '',
  disabled = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`} style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.375rem',
            color: 'var(--color-text)',
          }}
        >
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '0.875rem',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <Icon size={18} />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input ${error ? 'input-error' : ''}`}
          style={{
            width: '100%',
            paddingLeft: Icon ? '2.5rem' : '0.875rem',
            paddingRight: rightElement ? '2.75rem' : '0.875rem',
            paddingTop: '0.625rem',
            paddingBottom: '0.625rem',
            border: error ? '1.5px solid var(--color-danger)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9375rem',
            backgroundColor: disabled ? 'var(--color-surface-hover)' : 'var(--color-surface)',
            color: 'var(--color-text)',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          {...props}
        />

        {rightElement && (
          <div
            style={{
              position: 'absolute',
              right: '0.75rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}

      {!error && helperText && (
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}

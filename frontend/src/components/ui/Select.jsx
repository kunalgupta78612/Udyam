import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`} style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label
          htmlFor={selectId}
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
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`input ${error ? 'input-error' : ''}`}
          style={{
            width: '100%',
            padding: '0.625rem 2.5rem 0.625rem 0.875rem',
            border: error ? '1.5px solid var(--color-danger)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9375rem',
            backgroundColor: disabled ? 'var(--color-surface-hover)' : 'var(--color-surface)',
            color: value ? 'var(--color-text)' : 'var(--color-text-muted)',
            appearance: 'none',
            cursor: 'pointer',
            outline: 'none',
          }}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal} style={{ color: 'var(--color-text)' }}>
                {optLabel}
              </option>
            );
          })}
        </select>

        <div
          style={{
            position: 'absolute',
            right: '0.875rem',
            pointerEvents: 'none',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronDown size={18} />
        </div>
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

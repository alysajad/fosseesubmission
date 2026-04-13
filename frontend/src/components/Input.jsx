import React, { useState, useId } from 'react';
import styles from './Input.module.css';

export default function Input({
  label, name, type = 'text', error, help, required = false,
  value, defaultValue, onChange, onBlur, className = '',
  prefix, showToggle = false, ...props
}) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showToggle && showPassword ? 'text' : type;

  return (
    <div className={`${styles.group} ${error ? styles.hasError : ''} ${className}`}>
      {label && (
        <label className={`${styles.label} ${required ? styles.required : ''}`} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`${styles.wrapper} ${prefix ? styles.hasPrefix : ''}`}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          id={id}
          name={name}
          type={inputType}
          className={styles.input}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          aria-describedby={error ? `${id}-error` : help ? `${id}-help` : undefined}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {showToggle && type === 'password' && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {showPassword ? (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </>
              ) : (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </>
              )}
            </svg>
          </button>
        )}
      </div>
      {help && !error && <div className={styles.help} id={`${id}-help`}>{help}</div>}
      {error && <div className={styles.error} id={`${id}-error`} role="alert">{error}</div>}
    </div>
  );
}

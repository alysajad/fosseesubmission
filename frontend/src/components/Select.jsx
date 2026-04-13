import React, { useId } from 'react';
import styles from './Input.module.css';

export default function Select({ label, name, options = [], error, required, value, defaultValue, onChange, className = '', ...props }) {
  const id = useId();
  return (
    <div className={`${styles.group} ${error ? styles.hasError : ''} ${className}`}>
      {label && <label className={`${styles.label} ${required ? styles.required : ''}`} htmlFor={id}>{label}</label>}
      <select id={id} name={name} className={styles.input} value={value} defaultValue={defaultValue} onChange={onChange} style={{ cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23556070' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }} {...props}>
        {options.map(([val, display]) => <option key={val} value={val}>{display}</option>)}
      </select>
      {error && <div className={styles.error} id={`${id}-error`} role="alert">{error}</div>}
    </div>
  );
}

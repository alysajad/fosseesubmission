import React from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, type = 'info', onDismiss }) {
  return (
    <div className={`${styles.toast} ${styles[type]}`} role="status" aria-live="polite">
      <span className={styles.message}>{message}</span>
      {onDismiss && <button className={styles.close} onClick={onDismiss} aria-label="Dismiss">&times;</button>}
    </div>
  );
}

export function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((t, i) => <Toast key={i} {...t} onDismiss={() => onDismiss?.(i)} />)}
    </div>
  );
}

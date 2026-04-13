import React from 'react';
import styles from './Alert.module.css';

export default function Alert({ children, type = 'error', onDismiss }) {
  return (
    <div className={`${styles.alert} ${styles[type]}`} role="alert">
      <span className={styles.content}>{children}</span>
      {onDismiss && <button className={styles.close} onClick={onDismiss} aria-label="Dismiss">&times;</button>}
    </div>
  );
}

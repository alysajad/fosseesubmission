import React from 'react';
import styles from './LoginPage.module.css';

export default function LogoutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>👋</div>
        <h1 className={styles.title}>See You Soon!</h1>
        <p className={styles.subtitle}>You have been signed out successfully.</p>
        <a href="/workshop/login/" style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>Sign in again</a>
      </div>
    </div>
  );
}

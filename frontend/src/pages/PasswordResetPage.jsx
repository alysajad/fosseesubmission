import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import styles from './LoginPage.module.css';

export default function PasswordResetPage({ data }) {
  const csrfToken = window.__CSRF_TOKEN__;
  const [loading, setLoading] = useState(false);
  const stage = data?.stage || 'form';
  const errors = data?.errors || {};

  // Stage: form | done | confirm | complete
  if (stage === 'complete') {
    return (
      <div className={styles.page}>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✓</div>
          <h1 className={styles.title}>Password Reset Complete</h1>
          <p className={styles.subtitle}>Your password has been set. You may go ahead and sign in now.</p>
          <a href="/workshop/login/"><Button variant="primary" size="lg">Sign In</Button></a>
        </div>
      </div>
    );
  }
  if (stage === 'done') {
    return (
      <div className={styles.page}>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📧</div>
          <h1 className={styles.title}>Email Sent</h1>
          <p className={styles.subtitle}>We've sent you instructions for setting your password. If you don't receive an email, please make sure you've entered the address you registered with.</p>
        </div>
      </div>
    );
  }
  if (stage === 'confirm') {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>Set New Password</h1>
          <p className={styles.subtitle}>Enter your new password below</p>
          <form method="post" action="" onSubmit={() => setLoading(true)}>
            <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
            {Object.entries(errors).map(([f, msgs]) => Array.isArray(msgs) && msgs.map((m, i) => <Alert key={`${f}${i}`} type="error">{m}</Alert>))}
            <Input label="New Password" name="new_password1" type="password" required showToggle />
            <Input label="Confirm Password" name="new_password2" type="password" required showToggle />
            <Button type="submit" variant="primary" size="lg" block loading={loading}>Set Password</Button>
          </form>
        </div>
      </div>
    );
  }
  // Default: form
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.subtitle}>Enter your email address and we'll send you a link to reset your password</p>
        <form method="post" action="" onSubmit={() => setLoading(true)}>
          <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
          {Object.entries(errors).map(([f, msgs]) => Array.isArray(msgs) && msgs.map((m, i) => <Alert key={`${f}${i}`} type="error">{m}</Alert>))}
          <Input label="Email Address" name="email" type="email" required placeholder="you@example.com" />
          <Button type="submit" variant="primary" size="lg" block loading={loading}>Send Reset Link</Button>
        </form>
        <div className={styles.footer} style={{ marginTop: 'var(--space-5)' }}>
          <a href="/workshop/login/">Back to Sign In</a>
        </div>
      </div>
    </div>
  );
}

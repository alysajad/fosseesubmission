import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import styles from './LoginPage.module.css';

export default function PasswordChangePage({ data }) {
  const user = data?.user;
  const csrfToken = window.__CSRF_TOKEN__;
  const [loading, setLoading] = useState(false);
  const errors = data?.errors || {};

  return (
    <>
      <NavBar user={user} isInstructor={data?.isInstructor} />
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>Change Password</h1>
          <p className={styles.subtitle}>Enter your current and new password</p>
          <form method="post" action="" onSubmit={() => setLoading(true)}>
            <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
            {Object.entries(errors).map(([f, msgs]) => Array.isArray(msgs) && msgs.map((m, i) => <Alert key={`${f}${i}`} type="error">{m}</Alert>))}
            <Input label="Current Password" name="old_password" type="password" required showToggle />
            <Input label="New Password" name="new_password1" type="password" required showToggle />
            <Input label="Confirm New Password" name="new_password2" type="password" required showToggle />
            <Button type="submit" variant="primary" size="lg" block loading={loading}>Change Password</Button>
          </form>
        </div>
      </div>
    </>
  );
}

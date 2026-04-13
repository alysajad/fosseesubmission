import React from 'react';
import NavBar from '../components/NavBar';
import Button from '../components/Button';
import styles from './LoginPage.module.css';

export default function ActivationPage({ data }) {
  const status = data?.status;
  const configs = {
    '0': { icon: '✓', title: 'Account Activated!', desc: 'Your email has been verified. You can now sign in.', btnText: 'Sign In', btnHref: '/workshop/login/' },
    '1': { icon: '⏰', title: 'Link Expired', desc: 'Your activation link has expired. Please register again.', btnText: 'Register', btnHref: '/workshop/register/' },
    '2': { icon: '✓', title: 'Already Verified', desc: 'Your account is already active.', btnText: 'Go to Dashboard', btnHref: '/workshop/' },
    default: { icon: '📧', title: 'Verify Your Email', desc: 'We\'ve sent an activation link to your email. Please check your inbox and click the link to activate your account.', btnText: 'Back to Login', btnHref: '/workshop/login/' },
  };
  const cfg = configs[status] || configs.default;

  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>{cfg.icon}</div>
          <h1 className={styles.title}>{cfg.title}</h1>
          <p className={styles.subtitle}>{cfg.desc}</p>
          <a href={cfg.btnHref}><Button variant="primary" size="lg">{cfg.btnText}</Button></a>
        </div>
      </div>
    </>
  );
}

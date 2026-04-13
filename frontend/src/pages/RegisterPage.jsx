import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Alert from '../components/Alert';
import AuroraBg from '../components/AuroraBg';
import AnimatedContainer from '../components/AnimatedContainer';
import styles from './LoginPage.module.css';
import regStyles from './RegisterPage.module.css';

export default function RegisterPage({ data }) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const errors = data?.errors || {};
  const choices = data?.choices || {};
  const csrfToken = window.__CSRF_TOKEN__;

  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)) score++;
    return score;
  };
  const strength = getStrength(password);

  const allErrors = [];
  Object.entries(errors).forEach(([field, msgs]) => {
    if (Array.isArray(msgs)) msgs.forEach(m => allErrors.push({ field, msg: m }));
  });

  return (
    <>
      <NavBar urls={{ login: '/workshop/login/' }} />
      <AuroraBg>
        <div className={styles.page} style={{ alignItems: 'flex-start', paddingTop: 'calc(68px + var(--space-8))' }}>
          <div className={styles.card} style={{ maxWidth: 560 }}>
            <AnimatedContainer>
              <h1 className={styles.title}>Create Account</h1>
              <p className={styles.subtitle}>Register as a coordinator to propose workshops</p>

              <form method="post" action="" onSubmit={() => setLoading(true)}>
                <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />

                {allErrors.map((e, i) => <Alert key={i} type="error"><strong>{e.field}:</strong> {e.msg}</Alert>)}

                <Input label="Username" name="username" required placeholder="Choose a username"
                  defaultValue={data?.values?.username || ''} help="Letters, digits, period and underscore only." />

                <Input label="Email Address" name="email" type="email" required placeholder="you@example.com"
                  defaultValue={data?.values?.email || ''} />

                <div className={regStyles.grid2}>
                  <div>
                    <Input label="Password" name="password" type="password" required placeholder="Create password"
                      showToggle onChange={(e) => setPassword(e.target.value)} />
                    <div className={regStyles.strengthRow}>
                      {[0,1,2].map(i => (
                        <div key={i} className={`${regStyles.strengthBar} ${strength > i ? regStyles[`str${strength}`] : ''}`} />
                      ))}
                    </div>
                  </div>
                  <Input label="Confirm Password" name="confirm_password" type="password" required placeholder="Repeat password" showToggle />
                </div>

                <div className={regStyles.grid2}>
                  <Select label="Title" name="title" required options={choices.title || []} defaultValue={data?.values?.title} />
                  <Input label="First Name" name="first_name" required placeholder="First name" defaultValue={data?.values?.first_name || ''} />
                </div>

                <Input label="Last Name" name="last_name" required placeholder="Last name" defaultValue={data?.values?.last_name || ''} />

                <Input label="Phone Number" name="phone_number" required placeholder="10-digit number"
                  prefix="+91" maxLength={10} defaultValue={data?.values?.phone_number || ''} />

                <Input label="Institute / College" name="institute" required placeholder="Full name of your institution"
                  help="Please write the full name of your Institute/Organization" defaultValue={data?.values?.institute || ''} />

                <div className={regStyles.grid2}>
                  <Select label="Department" name="department" required options={choices.department || []} defaultValue={data?.values?.department} />
                  <Input label="Location (City)" name="location" required placeholder="Your city" defaultValue={data?.values?.location || ''} />
                </div>

                <div className={regStyles.grid2}>
                  <Select label="State" name="state" required options={choices.state || []} defaultValue={data?.values?.state} />
                  <Select label="How did you hear about us?" name="how_did_you_hear_about_us" options={choices.source || []} defaultValue={data?.values?.how_did_you_hear_about_us} />
                </div>

                <Button type="submit" variant="primary" size="lg" block loading={loading} style={{ marginTop: 'var(--space-4)' }}>
                  Create Account
                </Button>
              </form>

              <div className={styles.divider}><span>or</span></div>
              <div className={styles.footer}>Already have an account? <a href="/workshop/login/">Sign in</a></div>
            </AnimatedContainer>
          </div>
        </div>
      </AuroraBg>
    </>
  );
}

import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import styles from './WorkshopTypesPage.module.css';

export default function AddWorkshopTypePage({ data }) {
  const user = data?.user;
  const csrfToken = window.__CSRF_TOKEN__;
  const [loading, setLoading] = useState(false);
  const errors = data?.errors || {};

  return (
    <>
      <NavBar user={user} isInstructor />
      <main className={styles.main} id="main">
        <div className={styles.container} style={{ maxWidth: 640 }}>
          <h1 className={styles.heading}>Add Workshop Type</h1>
          <p className={styles.subheading} style={{ marginBottom: 'var(--space-6)' }}>Create a new workshop type for coordinators to propose</p>
          <Card hover={false}>
            <form method="post" action="" onSubmit={() => setLoading(true)}>
              <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
              {Object.entries(errors).map(([f, msgs]) => Array.isArray(msgs) && msgs.map((m, i) => <Alert key={`${f}${i}`} type="error">{m}</Alert>))}
              <Input label="Workshop Name" name="name" required placeholder="e.g., Python 3.x" defaultValue={data?.values?.name || ''} />
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label style={{ display: 'block', fontFamily: 'DM Sans', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Description <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <textarea name="description" required rows={6} placeholder="Describe the workshop..." defaultValue={data?.values?.description || ''} style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'DM Sans, sans-serif', fontSize: 'var(--text-base)', resize: 'vertical', outline: 'none' }} />
              </div>
              <Input label="Duration (days)" name="duration" type="number" required min={1} placeholder="e.g., 3" defaultValue={data?.values?.duration || ''} />
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label style={{ display: 'block', fontFamily: 'DM Sans', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Terms & Conditions <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <textarea name="terms_and_conditions" required rows={6} placeholder="Terms and conditions..." defaultValue={data?.values?.terms_and_conditions || ''} style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'DM Sans, sans-serif', fontSize: 'var(--text-base)', resize: 'vertical', outline: 'none' }} />
              </div>
              <Button type="submit" variant="primary" size="lg" block loading={loading}>Create Workshop Type</Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

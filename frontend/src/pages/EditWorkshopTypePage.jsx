import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from './WorkshopTypesPage.module.css';

export default function EditWorkshopTypePage({ data }) {
  const user = data?.user;
  const csrfToken = window.__CSRF_TOKEN__;
  const [loading, setLoading] = useState(false);
  const form = data?.form || {};
  const attachments = data?.attachments || [];

  return (
    <>
      <NavBar user={user} isInstructor />
      <main className={styles.main} id="main">
        <div className={styles.container} style={{ maxWidth: 640 }}>
          <h1 className={styles.heading}>Edit Workshop Type</h1>
          <Card hover={false} style={{ marginTop: 'var(--space-5)' }}>
            <form method="post" action="" encType="multipart/form-data" onSubmit={() => setLoading(true)}>
              <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
              <Input label="Workshop Name" name="name" required defaultValue={form.name || ''} />
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label style={{ display: 'block', fontFamily: 'DM Sans', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Description *</label>
                <textarea name="description" required rows={6} defaultValue={form.description || ''} style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'DM Sans', fontSize: 'var(--text-base)', resize: 'vertical', outline: 'none' }} />
              </div>
              <Input label="Duration (days)" name="duration" type="number" required min={1} defaultValue={form.duration || ''} />
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label style={{ display: 'block', fontFamily: 'DM Sans', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Terms & Conditions *</label>
                <textarea name="terms_and_conditions" required rows={6} defaultValue={form.terms_and_conditions || ''} style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'DM Sans', fontSize: 'var(--text-base)', resize: 'vertical', outline: 'none' }} />
              </div>
              {attachments.length > 0 && (
                <div style={{ marginBottom: 'var(--space-5)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>Current Attachments</h4>
                  {attachments.map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-divider)' }}>
                      <a href={a.url} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-info)' }}>{a.name}</a>
                      <a href={`/workshop/delete_attachment_file/${a.id}`} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}>Delete</a>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label style={{ display: 'block', fontFamily: 'DM Sans', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Add Attachment</label>
                <input type="file" name="attachments" style={{ fontSize: 'var(--text-sm)' }} />
              </div>
              <Button type="submit" variant="primary" size="lg" block loading={loading}>Save Changes</Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Alert from '../components/Alert';
import styles from './WorkshopTypesPage.module.css';

export default function WorkshopDetailPage({ data }) {
  const user = data?.user;
  const workshop = data?.workshop || {};
  const comments = data?.comments || [];
  const csrfToken = window.__CSRF_TOKEN__;
  const [loading, setLoading] = useState(false);

  const statusVariant = { 0: 'warning', 1: 'success', 2: 'error' };

  return (
    <>
      <NavBar user={user} isInstructor={data?.isInstructor} />
      <main className={styles.main} id="main">
        <div className={styles.container} style={{ maxWidth: 900 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
            <Card hover={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'var(--text-xl)', fontWeight: 700 }}>{workshop.workshopType}</h1>
                <Badge variant={statusVariant[workshop.status] || 'default'}>{workshop.statusDisplay}</Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                {[
                  ['Date', workshop.date],
                  ['Coordinator', workshop.coordinatorName],
                  ['Instructor', workshop.instructorName || 'Not assigned'],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>{label}</div>
                    <div style={{ fontWeight: 500 }}>{val}</div>
                  </div>
                ))}
              </div>
            </Card>

            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Comments ({comments.length})</h2>
              {comments.map(c => (
                <Card key={c.id} hover={false} style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>{c.author}</strong>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{c.date}</span>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>{c.comment}</p>
                </Card>
              ))}

              <Card hover={false} style={{ marginTop: 'var(--space-5)' }}>
                <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-4)' }}>Post a Comment</h3>
                <form method="post" action="" onSubmit={() => setLoading(true)}>
                  <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
                  <textarea name="comment" required rows={4} placeholder="Write your comment..." style={{
                    width: '100%', padding: 'var(--space-3) var(--space-4)', border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)', fontFamily: 'DM Sans, sans-serif', fontSize: 'var(--text-base)',
                    resize: 'vertical', outline: 'none', transition: 'border-color 150ms'
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                    {data?.isInstructor && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                        <input type="checkbox" name="public" defaultChecked style={{ accentColor: 'var(--color-accent)' }} /> Public
                      </label>
                    )}
                    <Button type="submit" variant="primary" size="sm" loading={loading} style={{ marginLeft: 'auto' }}>Post Comment</Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

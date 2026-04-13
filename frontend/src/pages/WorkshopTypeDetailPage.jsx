import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Badge from '../components/Badge';
import styles from './WorkshopTypesPage.module.css';

export default function WorkshopTypeDetailPage({ data }) {
  const user = data?.user;
  const wt = data?.workshopType || {};

  return (
    <>
      <NavBar user={user} isInstructor={data?.isInstructor} />
      <main className={styles.main} id="main">
        <div className={styles.container} style={{ maxWidth: 900 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
            <div>
              <Badge variant="accent" style={{ marginBottom: 'var(--space-3)' }}>{wt.duration} day{wt.duration !== 1 ? 's' : ''}</Badge>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>{wt.name}</h1>
              <Card hover={false}>
                <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-3)' }}>Description</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{wt.description}</p>
              </Card>
              {wt.terms && (
                <Card hover={false} style={{ marginTop: 'var(--space-4)' }}>
                  <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-3)' }}>Terms & Conditions</h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{wt.terms}</p>
                </Card>
              )}
              {wt.attachments && wt.attachments.length > 0 && (
                <Card hover={false} style={{ marginTop: 'var(--space-4)' }}>
                  <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-3)' }}>Attachments</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {wt.attachments.map((a, i) => (
                      <li key={i}><a href={a.url} style={{ color: 'var(--color-info)', fontSize: 'var(--text-sm)' }}>{a.name}</a></li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

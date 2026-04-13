import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Badge from '../components/Badge';
import styles from './WorkshopTypesPage.module.css';

export default function ProfilePage({ data }) {
  const user = data?.user;
  const profile = data?.profile;
  const coordinator = data?.coordinatorProfile;
  const workshops = data?.workshops || [];
  const form = data?.form;
  const isOwnProfile = data?.isOwnProfile;
  const csrfToken = window.__CSRF_TOKEN__;
  const [loading, setLoading] = useState(false);

  const displayProfile = coordinator || profile;

  return (
    <>
      <NavBar user={user} isInstructor={data?.isInstructor} />
      <main className={styles.main} id="main">
        <div className={styles.container} style={{ maxWidth: 800 }}>
          <h1 className={styles.heading}>{isOwnProfile ? 'My Profile' : `${displayProfile?.fullName}'s Profile`}</h1>

          {isOwnProfile && form ? (
            <Card hover={false} style={{ marginTop: 'var(--space-5)' }}>
              <form method="post" action="" onSubmit={() => setLoading(true)}>
                <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 var(--space-5)' }}>
                  <Select label="Title" name="title" options={form.choices?.title || []} defaultValue={form.values?.title} />
                  <Input label="First Name" name="first_name" defaultValue={form.values?.first_name} required />
                </div>
                <Input label="Last Name" name="last_name" defaultValue={form.values?.last_name} required />
                <Input label="Phone Number" name="phone_number" defaultValue={form.values?.phone_number} required prefix="+91" maxLength={10} />
                <Input label="Institute" name="institute" defaultValue={form.values?.institute} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 var(--space-5)' }}>
                  <Select label="Department" name="department" options={form.choices?.department || []} defaultValue={form.values?.department} required />
                  <Input label="Location" name="location" defaultValue={form.values?.location} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 var(--space-5)' }}>
                  <Select label="State" name="state" options={form.choices?.state || []} defaultValue={form.values?.state} required />
                  <Input label="Position" name="position" defaultValue={form.values?.position} disabled />
                </div>
                <Button type="submit" variant="primary" size="lg" loading={loading} style={{ marginTop: 'var(--space-4)' }}>Update Profile</Button>
              </form>
            </Card>
          ) : displayProfile && (
            <Card hover={false} style={{ marginTop: 'var(--space-5)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {[
                  ['Name', displayProfile.fullName],
                  ['Email', displayProfile.email],
                  ['Phone', displayProfile.phone],
                  ['Institute', displayProfile.institute],
                  ['Department', displayProfile.department],
                  ['Location', displayProfile.location],
                  ['State', displayProfile.state],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>{label}</div>
                    <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{val || '—'}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {workshops && workshops.length > 0 && (
            <div style={{ marginTop: 'var(--space-8)' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Workshop History</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {workshops.map(w => (
                  <Card key={w.id} hover>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      <div>
                        <strong>{w.workshopType}</strong>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginLeft: 'var(--space-2)' }}>{w.date}</span>
                      </div>
                      <Badge variant={w.status === 1 ? 'success' : w.status === 0 ? 'warning' : 'error'}>{w.statusDisplay}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

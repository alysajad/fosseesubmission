import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Tabs from '../components/Tabs';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import AnimatedContainer from '../components/AnimatedContainer';
import StarBorder from '../components/StarBorder';
import CalendarAvailability from '../components/CalendarAvailability';
import { useUndoAction } from '../components/useUndoAction';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WorkshopTypesPage.module.css';
import api from '../api';

export default function InstructorDashPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = data?.user;
  const workshops = data?.workshops || [];
  const csrfToken = window.__CSRF_TOKEN__;
  const [changingDate, setChangingDate] = useState(null);
  const [newDate, setNewDate] = useState('');
  
  const { triggerAction, UndoToast } = useUndoAction();


  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await api.get('/workshop/dashboard');
        if (active) setData(response.data);
      } catch (err) {
        if (active) setError('Unable to load instructor dashboard data.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const [localWorkshops, setLocalWorkshops] = useState([]);
  useEffect(() => {
    setLocalWorkshops(workshops);
  }, [workshops]);

  const accepted = localWorkshops.filter(w => w.status === 1);
  const pending = localWorkshops.filter(w => w.status === 0);

  const handleReject = (wId) => {

    setLocalWorkshops(prev => prev.filter(w => w.id !== wId));
    triggerAction(() => {

      window.location.href = `/workshop/reject_workshop/${wId}`;
    }, "Workshop proposal rejected.", 5000);
  };

  const AcceptedList = () => {
    if (!accepted.length) return <EmptyState title="No accepted workshops" description="Accept pending proposals below" />;
    return (
      <AnimatedContainer style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <AnimatePresence>
          {accepted.map(w => (
            <Card key={w.id} hover>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div>
                  <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, marginBottom: 'var(--space-1)' }}>{w.workshopType}</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                    {w.date} · Coordinator: <a href={`/workshop/view_profile/${w.coordinatorId}`}>{w.coordinatorName}</a>
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <Badge variant="success">Accepted</Badge>
                  <button onClick={() => setChangingDate(w.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-info)', fontSize: 'var(--text-xs)' }}>Change Date</button>
                </div>
              </div>
              {changingDate === w.id && (
                <form method="post" action={`/workshop/change_workshop_date/${w.id}`} style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
                  <div>
                    <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--space-1)' }}>New Date</label>
                    <input type="date" name="new_date" value={newDate} onChange={e => setNewDate(e.target.value)} required style={{ height: 40, padding: '0 var(--space-3)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'DM Sans', fontSize: 'var(--text-sm)' }} />
                  </div>
                  <Button type="submit" variant="primary" size="sm">Update</Button>
                  <Button variant="ghost" size="sm" type="button" onClick={() => setChangingDate(null)}>Cancel</Button>
                </form>
              )}
            </Card>
          ))}
        </AnimatePresence>
      </AnimatedContainer>
    );
  };

  const PendingList = () => {
    if (!pending.length) return <EmptyState title="No pending proposals" description="All caught up!" />;
    return (
      <AnimatedContainer style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <AnimatePresence>
          {pending.map(w => (
            <motion.div key={w.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, x: -50, height: 0 }}>
              <Card hover>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                  <div>
                    <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, marginBottom: 'var(--space-1)' }}>{w.workshopType}</h4>
                    <p style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-primary)', margin: '0 0 var(--space-1)' }}>{w.date}</p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                      <a href={`/workshop/view_profile/${w.coordinatorId}`}>{w.coordinatorName}</a>, {w.coordinatorInstitute}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <a href={`/workshop/accept_workshop/${w.id}`} style={{ textDecoration: 'none' }}>
                      <StarBorder color="var(--color-success)">Accept Schedule</StarBorder>
                    </a>
                    <Button variant="danger" size="md" onClick={() => handleReject(w.id)}>Decline</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </AnimatedContainer>
    );
  };

  return (
    <>
      <NavBar user={user} isInstructor urls={{ dashboard: '/instructor' }} />
      <main className={styles.main} id="main">
        <div className={styles.container}>
          {loading && <p className={styles.subheading}>Loading dashboard...</p>}
          {!loading && error && <p className={styles.subheading}>{error}</p>}
          <h1 className={styles.heading}>Instructor Dashboard</h1>
          <p className={styles.subheading} style={{ marginBottom: 'var(--space-6)' }}>Manage workshop proposals and accepted sessions</p>
          <Tabs tabs={[
            { label: 'Pending Proposals', count: pending.length, content: <PendingList /> },
            { label: 'Accepted Framework', count: accepted.length, content: <AcceptedList /> },
            { label: 'Calendar Rules', content: <AnimatedContainer><Card hover={false}><CalendarAvailability /></Card></AnimatedContainer> },
          ]} />
        </div>
      </main>
      <UndoToast />
      <Footer />
    </>
  );
}

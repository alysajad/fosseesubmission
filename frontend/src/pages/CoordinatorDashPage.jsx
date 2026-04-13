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
import ShinyText from '../components/ShinyText';
import PostWorkshopChecklist from '../components/PostWorkshopChecklist';
import FeedbackForm from '../components/FeedbackForm';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WorkshopTypesPage.module.css';
import api from '../api';

export default function CoordinatorDashPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await api.get('/workshop/status');
        if (active) setData(response.data);
      } catch (err) {
        if (active) setError('Unable to load coordinator dashboard data.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const user = data?.user;
  const workshops = data?.workshops || [];
  
  const [feedbackOpenId, setFeedbackOpenId] = useState(null);

  const accepted = workshops.filter(w => w.status === 1);
  const proposed = workshops.filter(w => w.status === 0);

  const WorkshopList = ({ items, isAcceptedList }) => {
    if (!items.length) return (
      <AnimatedContainer>
        <EmptyState
          icon={<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="16" y="16" width="48" height="48" rx="8"/><line x1="16" y1="32" x2="64" y2="32"/><line x1="32" y1="16" x2="32" y2="32"/><line x1="48" y1="16" x2="48" y2="32"/><circle cx="40" cy="50" r="6"/><line x1="40" y1="56" x2="40" y2="60"/><line x1="36" y1="60" x2="44" y2="60"/></svg>}
          title="No workshops yet"
          description="Propose a workshop to get started"
          action={<a href="/workshop/propose/"><StarBorder speed="4s" color="var(--color-primary)">Propose Workshop</StarBorder></a>}
        />
      </AnimatedContainer>
    );
    return (
      <AnimatedContainer style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <AnimatePresence>
          {items.map(w => (
            <motion.div 
              key={w.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card hover={false}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: isAcceptedList ? 'var(--space-4)' : 0 }}>
                  <a href={`/workshop/details/${w.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                    <div>
                      <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>{w.workshopType}</h4>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>{w.date}</p>
                    </div>
                  </a>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <Badge variant={w.status === 1 ? 'success' : 'warning'}>{w.statusDisplay}</Badge>
                    {isAcceptedList && <Button size="sm" variant="ghost" onClick={() => setFeedbackOpenId(w.id)}>Submit Feedback</Button>}
                  </div>
                </div>
                {isAcceptedList && <PostWorkshopChecklist workshopId={w.id} />}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </AnimatedContainer>
    );
  };

  return (
    <>
      <NavBar user={user} urls={{ dashboard: '/coordinator', proposeWorkshop: '/propose' }} />
      <main className={styles.main} id="main">
        <div className={styles.container}>
          {loading && <p className={styles.subheading}>Loading dashboard...</p>}
          {!loading && error && <p className={styles.subheading}>{error}</p>}
          <AnimatedContainer stagger={false}>
            <div className={styles.header} style={{ marginBottom: 'var(--space-6)' }}>
              <div>
                <h1 className={styles.heading} style={{ marginBottom: 'var(--space-2)' }}><ShinyText text="My Workshops" speed={4} /></h1>
                <p className={styles.subheading}>Track your proposed and accepted workshops</p>
              </div>
              <a href="/workshop/propose/"><StarBorder color="var(--color-accent)">+ Propose Session</StarBorder></a>
            </div>
            <Tabs tabs={[
              { label: 'Accepted', count: accepted.length, content: <WorkshopList items={accepted} isAcceptedList={true} /> },
              { label: 'Proposed', count: proposed.length, content: <WorkshopList items={proposed} isAcceptedList={false} /> },
            ]} />
          </AnimatedContainer>
        </div>
      </main>
      
      <AnimatePresence>
        {feedbackOpenId && <FeedbackForm workshopId={feedbackOpenId} onClose={() => setFeedbackOpenId(null)} />}
      </AnimatePresence>

      <Footer />
    </>
  );
}

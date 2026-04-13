import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

export default function PostWorkshopChecklist({ workshopId }) {
    const tasks = [
        "Upload attendance sheet",
        "Fill 5-question feedback form",
        "Generate & Distribute certificates",
        "Submit workshop photos"
    ];
    const [completed, setCompleted] = useState([false, false, false, false]);

    const toggle = (idx) => {
        setCompleted(prev => {
            const next = [...prev];
            next[idx] = !next[idx];
            return next;
        });
    };

    const isAllDone = completed.every(Boolean);

    return (
        <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
            <h4 style={{ marginBottom: 'var(--space-3)' }}>Post-Workshop Action Items</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {tasks.map((task, i) => (
                    <motion.div 
                        key={i}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggle(i)}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: '1px solid', borderColor: completed[i] ? 'var(--color-success)' : 'var(--color-border)' }}
                    >
                        <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid', borderColor: completed[i] ? 'var(--color-success)' : 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: completed[i] ? 'var(--color-success)' : 'transparent', color: '#fff' }}>
                            {completed[i] && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                        <span style={{ textDecoration: completed[i] ? 'line-through' : 'none', color: completed[i] ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>{task}</span>
                    </motion.div>
                ))}
            </div>
            <AnimatePresence>
                {isAllDone && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 16 }} exit={{ opacity: 0, height: 0 }}>
                        <Button variant="primary" block>Finalize Workshop Report</Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

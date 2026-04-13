import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

export default function FeedbackForm({ workshopId, onClose }) {
  const [step, setStep] = useState(1);

  const questions = [
    "Rate the instructor's communication.",
    "Rate the workshop material.",
    "Did the workshop meet your expectations?",
    "Would you recommend this workshop?",
    "Any additional comments?"
  ];

  const handleNext = () => setStep(s => Math.min(s + 1, questions.length + 1));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, background: 'var(--color-bg)', padding: 'var(--space-6)', borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)', boxShadow: '0 -10px 40px rgba(0,0,0,0.15)' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--color-text-secondary)' }}>&times;</button>
      
      <AnimatePresence mode="wait">
        {step <= questions.length ? (
            <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-ms)', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Question {step} of {questions.length}</p>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-6)' }}>{questions[step - 1]}</h3>
                
                {step < 5 ? (
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                        {[1,2,3,4,5].map(rating => (
                            <Button key={rating} variant="ghost" style={{ flex: 1, height: 60, fontSize: 'var(--text-lg)' }} onClick={handleNext}>{rating}</Button>
                        ))}
                    </div>
                ) : (
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <textarea style={{ width: '100%', height: 100, padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontFamily: 'inherit' }} placeholder="Optional feedback..." />
                        <Button variant="primary" block style={{ marginTop: 'var(--space-4)' }} onClick={handleNext}>Submit Feedback</Button>
                    </div>
                )}
                
                {step > 1 && <Button variant="ghost" onClick={handlePrev}>Back</Button>}
            </motion.div>
        ) : (
            <motion.div key="done" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--color-success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3>Feedback Submitted</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>Thank you for helping us improve.</p>
                <Button variant="primary" block onClick={onClose}>Close</Button>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

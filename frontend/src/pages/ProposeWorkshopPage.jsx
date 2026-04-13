import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Alert from '../components/Alert';
import AnimatedContainer from '../components/AnimatedContainer';
import styles from './WorkshopTypesPage.module.css';

export default function ProposeWorkshopPage({ data }) {
  const user = data?.user;
  const csrfToken = window.__CSRF_TOKEN__;
  const [loading, setLoading] = useState(false);
  const errors = data?.errors || {};
  const choices = data?.choices || {};
  
  const workshopTypes = choices.workshopTypes || [];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    workshop_type: '',
    date: '',
    tnc_accepted: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getTypeName = (id) => workshopTypes.find(t => t.value === id)?.label || 'Selected Workshop';

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <>
      <NavBar user={user} />
      <main className={styles.main} id="main">
        <AnimatedContainer className={styles.container} style={{ maxWidth: 640 }}>
          <h1 className={styles.heading}>Propose Workshop</h1>
          
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', alignItems: 'center' }}>
            {[1, 2, 3].map(i => (
              <React.Fragment key={i}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: 'var(--text-ms)', fontWeight: 600,
                  backgroundColor: step >= i ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                  color: step >= i ? '#fff' : 'var(--color-text-secondary)',
                  transition: 'background 0.3s'
                }}>
                  {i}
                </div>
                {i < 3 && <div style={{ height: 2, flex: 1, backgroundColor: step > i ? 'var(--color-primary)' : 'var(--color-divider)', transition: 'background 0.3s' }} />}
              </React.Fragment>
            ))}
          </div>

          <Card hover={false} style={{ overflow: 'hidden' }}>
            <form method="post" action="" onSubmit={() => setLoading(true)}>
              <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
              

              <input type="hidden" name="workshop_type" value={formData.workshop_type} />
              <input type="hidden" name="date" value={formData.date} />
              {formData.tnc_accepted && <input type="hidden" name="tnc_accepted" value="on" />}

              {Object.entries(errors).map(([field, msgs]) =>
                Array.isArray(msgs) && msgs.map((m, idx) => <Alert key={`${field}${idx}`} type="error"><strong>{field}:</strong> {m}</Alert>)
              )}

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <h3 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)' }}>Step 1: Content</h3>
                    <Select 
                      label="Select Workshop Type" 
                      name="_workshop_type_proxy"
                      required 
                      options={workshopTypes} 
                      value={formData.workshop_type}
                      onChange={(e) => handleChange({ target: { name: 'workshop_type', value: e.target.value }})}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-5)' }}>
                      <Button variant="primary" onClick={nextStep} disabled={!formData.workshop_type}>Continue</Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <h3 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)' }}>Step 2: Logistics</h3>
                    <Input 
                      label="Proposed Date" 
                      name="_date_proxy" 
                      type="date" 
                      required 
                      value={formData.date}
                      onChange={(e) => handleChange({ target: { name: 'date', value: e.target.value }})}
                    />
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', margin: 'var(--space-4) 0' }}>
                      <input 
                        type="checkbox" 
                        id="tnc" 
                        required 
                        checked={formData.tnc_accepted}
                        onChange={(e) => handleChange({ target: { name: 'tnc_accepted', type: 'checkbox', checked: e.target.checked }})}
                        style={{ marginTop: 4, width: 18, height: 18, accentColor: 'var(--color-accent)' }} 
                      />
                      <label htmlFor="tnc" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                        I accept the <a href="#" style={{ color: 'var(--color-info)' }}>terms and conditions</a> for this workshop.
                      </label>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-5)' }}>
                      <Button variant="ghost" onClick={prevStep}>Back</Button>
                      <Button variant="primary" onClick={nextStep} disabled={!formData.date || !formData.tnc_accepted}>Review</Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <h3 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)' }}>Step 3: Confirmation</h3>
                    <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)' }}>
                      <p style={{ margin: '0 0 var(--space-2)' }}><strong>Type:</strong> {getTypeName(formData.workshop_type)}</p>
                      <p style={{ margin: '0 0 var(--space-2)' }}><strong>Date:</strong> {formData.date}</p>
                      <p style={{ margin: '0', color: 'var(--color-success)', fontSize: 'var(--text-sm)' }}>✓ Terms Accepted</p>
                    </div>
                    <Alert type="info" style={{ marginBottom: 'var(--space-5)' }}>
                      By submitting, your proposal will be sent to the FOSSEE team for instructor matching.
                    </Alert>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant="ghost" onClick={prevStep}>Back</Button>
                      <Button type="submit" variant="primary" loading={loading} style={{ background: 'var(--color-accent)', color: '#fff' }}>Confirm & Submit</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Card>
        </AnimatedContainer>
      </main>
      <Footer />
    </>
  );
}

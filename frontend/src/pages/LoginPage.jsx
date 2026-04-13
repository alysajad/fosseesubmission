import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import AuroraBg from '../components/AuroraBg';
import AnimatedContainer from '../components/AnimatedContainer';
import styles from './LoginPage.module.css';
import api from '../api';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [nonFieldErrors, setNonFieldErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setNonFieldErrors([]);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await api.post('/workshop/login/', data);
      if (response.data.success) {
        const position = response.data.user.position;
        if (position === 'instructor') {
          navigate('/instructor');
        } else {
          navigate('/coordinator');
        }
      } else {
        if (response.data.error === 'not_activated') {
          navigate('/activate');
        } else {
          setErrors(response.data.errors || {});
          setNonFieldErrors(response.data.nonFieldErrors || []);
        }
      }
    } catch (err) {
      setNonFieldErrors(['An unexpected error occurred. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const input = document.querySelector('input[name="username"]');
    if (input) input.focus();
  }, []);

  return (
    <>
      <NavBar urls={{ register: '/register' }} />
      <AuroraBg>
        <div className={styles.page}>
          <div className={styles.card}>
            <AnimatedContainer>
              <h1 className={styles.title}>Welcome Back</h1>
              <p className={styles.subtitle}>Sign in to manage your workshops</p>

              <form onSubmit={handleSubmit}>
                {nonFieldErrors.map((err, i) => (
                  <Alert key={i} type="error">{err}</Alert>
                ))}
                {errors.username && errors.username.map((err, i) => <Alert key={`u${i}`} type="error">{err}</Alert>)}
                {errors.password && errors.password.map((err, i) => <Alert key={`p${i}`} type="error">{err}</Alert>)}

                <Input
                  label="Username"
                  name="username"
                  placeholder="Username"
                  required
                  error={errors.username?.[0]}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  showToggle
                  error={errors.password?.[0]}
                />

                <div className={styles.forgot}>
                  <Link to="/password-reset">Forgot password?</Link>
                </div>

                <Button type="submit" variant="primary" size="lg" block loading={loading}>
                  Sign In
                </Button>
              </form>

              <div className={styles.divider}><span>or</span></div>

              <div className={styles.footer}>
                New around here? <Link to="/register">Create an account</Link>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </AuroraBg>
    </>
  );
}

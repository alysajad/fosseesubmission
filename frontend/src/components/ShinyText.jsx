import React from 'react';
import styles from './ShinyText.module.css';

export default function ShinyText({ text, disabled = false, speed = 3, className = '' }) {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`${styles.shinyText} ${disabled ? styles.disabled : ''} ${className}`}
      style={{ backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', animationDuration }}
    >
      {text}
    </div>
  );
}

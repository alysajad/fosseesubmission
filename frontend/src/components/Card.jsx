import React from 'react';
import { motion } from 'framer-motion';
import styles from './Card.module.css';

export default function Card({ children, className = '', hover = true, ...props }) {
  if (!hover) return <div className={`${styles.card} ${styles.static} ${className}`} {...props}>{children}</div>;
  
  return (
    <motion.div 
      whileHover={{ scale: 1.015, y: -4, boxShadow: 'var(--shadow-modal)' }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`${styles.card} ${className}`} 
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`${styles.header} ${className}`}>{children}</div>;
}

export function CardTitle({ children, as: Tag = 'h3', className = '' }) {
  return <Tag className={`${styles.title} ${className}`}>{children}</Tag>;
}

export function CardBody({ children, className = '' }) {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
}

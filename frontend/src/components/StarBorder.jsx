import React from 'react';
import styles from './StarBorder.module.css';
import { motion } from 'framer-motion';

export default function StarBorder({ children, color = "var(--color-primary)", speed = "3s", as: Component = "button", className = "", ...props }) {
    return (
        <Component className={`${styles.starBorder} ${className}`} {...props}>
            <div className={styles.borderAnim} style={{ animationDuration: speed }}>
                <div className={styles.radialGradient} style={{ background: `radial-gradient(circle, ${color} 0%, transparent 100%)` }}></div>
            </div>
            <div className={styles.innerContent}>
                {children}
            </div>
        </Component>
    );
}

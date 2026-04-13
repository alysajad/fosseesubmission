import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import styles from './CalendarAvailability.module.css';

export default function CalendarAvailability() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Dummy data representing state of days in current month view
  // 0: free, 1: pending, 2: blocked
  const [dayStates, setDayStates] = useState(Array(31).fill(0).map((_, i) => {
    if (i === 12 || i === 13) return 1; // Pending
    if (i >= 20 && i <= 24) return 2; // Blocked
    return 0; // Free
  }));

  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null); // 'block' or 'free'

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handleMouseDown = (dayIndex) => {
    setIsDragging(true);
    const currentState = dayStates[dayIndex];
    // If it's free, dragging will block. If it's blocked, dragging will free.
    const newDragType = currentState === 2 ? 'free' : 'block';
    setDragType(newDragType);
    updateDayState(dayIndex, newDragType);
  };

  const handleMouseEnter = (dayIndex) => {
    if (isDragging && dragType) {
      updateDayState(dayIndex, dragType);
    }
  };

  const updateDayState = (dayIndex, type) => {
    setDayStates(prev => {
      const copy = [...prev];
      if (copy[dayIndex] !== 1) { // Prevents pending override in this simple demo
        copy[dayIndex] = type === 'block' ? 2 : 0;
      }
      return copy;
    });
  };

  const stopDragging = () => {
    setIsDragging(false);
    setDragType(null);
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className={styles.wrapper} onMouseUp={stopDragging} onMouseLeave={stopDragging}>
      <div className={styles.header}>
        <Button variant="ghost" size="sm" onClick={prevMonth}>&larr;</Button>
        <h3 className={styles.monthTitle}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <Button variant="ghost" size="sm" onClick={nextMonth}>&rarr;</Button>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendDot} style={{ background: 'var(--color-bg-secondary)' }} /> Free
        <span className={styles.legendDot} style={{ background: 'var(--color-warning)' }} /> Pending
        <span className={styles.legendDot} style={{ background: 'var(--color-text-secondary)' }} /> Blocked
      </div>

      <div className={styles.grid}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className={styles.dow}>{d}</div>
        ))}
        

        {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}


        {Array(daysInMonth).fill(null).map((_, i) => {
          const state = dayStates[i];
          let bg = 'var(--color-bg-secondary)'; // free
          let color = 'inherit';
          if (state === 1) { bg = 'var(--color-warning)'; color = '#fff'; }
          if (state === 2) { bg = 'var(--color-text-secondary)'; color = '#fff'; }
          
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseDown={() => handleMouseDown(i)}
              onMouseEnter={() => handleMouseEnter(i)}
              className={styles.day}
              style={{ background: bg, color }}
            >
              {i + 1}
            </motion.div>
          );
        })}
      </div>
      <p className={styles.tip}>Tip: Drag across dates to quickly mark them as available or blocked.</p>
    </div>
  );
}

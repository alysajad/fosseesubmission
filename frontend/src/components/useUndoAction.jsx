import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import styles from './UndoToast.module.css';

export function useUndoAction() {
  const [pendingAction, setPendingAction] = useState(null);

  const triggerAction = useCallback((actionFn, message, undoTimeout = 5000) => {
    const timeoutId = setTimeout(() => {
      actionFn();
      setPendingAction(null);
    }, undoTimeout);

    setPendingAction({
      message,
      timeoutId,
      cancel: () => {
        clearTimeout(timeoutId);
        setPendingAction(null);
      }
    });
  }, []);

  const UndoToast = () => (
    <AnimatePresence>
      {pendingAction && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={styles.toast}
        >
          <span>{pendingAction.message}</span>
          <button className={styles.undoBtn} onClick={pendingAction.cancel}>Undo</button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { triggerAction, UndoToast };
}

import { motion } from 'framer-motion';
import styles from './Button.module.css';

export default function Button({
  children, variant = 'primary', size = 'md', block = false,
  loading = false, disabled = false, type = 'button', className = '', ...props
}) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[`size_${size}`],
    block ? styles.block : '',
    loading ? styles.loading : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <motion.button 
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      whileHover={disabled || loading ? {} : { filter: 'brightness(1.05)' }}
      type={type} 
      className={cls} 
      disabled={disabled || loading} 
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      <span className={loading ? styles.hiddenText : ''}>{children}</span>
    </motion.button>
  );
}

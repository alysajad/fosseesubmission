import React from 'react';
import { motion } from 'framer-motion';

export default function AuroraBg({ children }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>

      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.4, 0.6],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(16,37,64,1) 0%, rgba(20,50,90,0) 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(245,166,35,0.3) 0%, rgba(245,166,35,0) 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      

      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

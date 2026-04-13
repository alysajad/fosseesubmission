import React, { useState } from 'react';
import styles from './Tabs.module.css';

export default function Tabs({ tabs, activeIndex = 0, onChange }) {
  const [active, setActive] = useState(activeIndex);
  const handleClick = (i) => { setActive(i); onChange?.(i); };

  return (
    <div>
      <div className={styles.tabList} role="tablist">
        {tabs.map((tab, i) => (
          <button key={i} role="tab" aria-selected={active === i} className={`${styles.tab} ${active === i ? styles.active : ''}`} onClick={() => handleClick(i)}>
            {tab.label}
            {tab.count != null && <span className={styles.count}>{tab.count}</span>}
          </button>
        ))}
      </div>
      <div className={styles.panel} role="tabpanel">{tabs[active]?.content}</div>
    </div>
  );
}

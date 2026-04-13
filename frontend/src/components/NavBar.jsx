import React, { useState, useEffect, useRef } from 'react';
import styles from './NavBar.module.css';
import fosseeLogo from '../assets/fossee-logo.svg';

export default function NavBar({ user, isInstructor, urls = {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      const onEsc = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
      window.addEventListener('keydown', onEsc);
      return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onEsc); };
    }
  }, [drawerOpen]);

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const initial = user?.firstName?.[0]?.toUpperCase() || 'U';

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} role="navigation" aria-label="Main navigation">
        <div className={styles.inner}>
          <a className={styles.brand} href={user ? (urls.index || '/') : '/'}>
            <img src={fosseeLogo} alt="FOSSEE logo" width="32" height="32" />
            <span>FOSSEE Workshops</span>
          </a>

          {user && (
            <ul className={styles.links}>
              <li><a href="/">Home</a></li>
              <li><a href={urls.statistics || '/statistics/public'}>Statistics</a></li>
              {isInstructor && <li><a href={urls.teamStats || '/statistics/team'}>Team Stats</a></li>}
              <li><a href={urls.dashboard || '/workshop/dashboard'}>Dashboard</a></li>
              {!isInstructor && <li><a href={urls.proposeWorkshop || '/workshop/propose/'}>Propose Workshop</a></li>}
              <li><a href={urls.workshopTypes || '/workshop/types/'}>Workshop Types</a></li>
            </ul>
          )}

          <div className={styles.right}>
            {user ? (
              <div className={styles.dropdown} ref={dropdownRef}>
                <button
                  className={styles.dropdownTrigger}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span className={styles.avatar}>{initial}</span>
                  <span className={styles.userName}>{user.fullName}</span>
                  <svg className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6l4 4 4-4"/></svg>
                </button>
                {dropdownOpen && (
                  <div className={styles.dropdownMenu} role="menu">
                    <a href={urls.profile || '/workshop/view_profile/'} role="menuitem">Profile</a>
                    <a href={urls.passwordChange || '/reset/password_change/'} role="menuitem">Change Password</a>
                    <a href={urls.logout || '/workshop/logout/'} role="menuitem">Logout</a>
                  </div>
                )}
              </div>
            ) : (
              <a href={urls.login || '/workshop/login/'} className={styles.signInBtn}>Sign In</a>
            )}

            <button
              className={`${styles.hamburger} ${drawerOpen ? styles.hamburgerActive : ''}`}
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>


      <div className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`} aria-hidden={!drawerOpen}>
        <button className={styles.drawerClose} onClick={() => setDrawerOpen(false)} aria-label="Close menu">&times;</button>
        <ul className={styles.drawerNav}>
          <li><a href="/" onClick={() => setDrawerOpen(false)}>Home</a></li>
          {user ? (
            <>
              <li><a href={urls.dashboard || '/workshop/dashboard'} onClick={() => setDrawerOpen(false)}>Dashboard</a></li>
              {!isInstructor && <li><a href={urls.proposeWorkshop || '/workshop/propose/'} onClick={() => setDrawerOpen(false)}>Propose Workshop</a></li>}
              <li><a href={urls.workshopTypes || '/workshop/types/'} onClick={() => setDrawerOpen(false)}>Workshop Types</a></li>
              <li><a href={urls.statistics || '/statistics/public'} onClick={() => setDrawerOpen(false)}>Statistics</a></li>
              <li><a href={urls.profile || '/workshop/view_profile/'} onClick={() => setDrawerOpen(false)}>Profile</a></li>
              <li><a href={urls.logout || '/workshop/logout/'} onClick={() => setDrawerOpen(false)}>Logout</a></li>
            </>
          ) : (
            <>
              <li><a href={urls.login || '/workshop/login/'} onClick={() => setDrawerOpen(false)}>Sign In</a></li>
              <li><a href={urls.register || '/workshop/register/'} onClick={() => setDrawerOpen(false)}>Register</a></li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

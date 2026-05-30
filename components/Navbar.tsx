'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/channels', label: 'Channels' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" aria-label="CricFoot home">
          <div className="nav-logo-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10,8 16,12 10,16 10,8" fill="white" stroke="none" />
            </svg>
          </div>
          <span className="nav-brand">CricFoot</span>
        </Link>

        <div className="nav-links nav-links-desktop">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${pathname === href ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <button
          className={`nav-hamburger${open ? ' open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="nav-mobile-menu" role="menu">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-mobile-link${pathname === href ? ' active' : ''}`}
              role="menuitem"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

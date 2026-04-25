'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when mobile nav open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path) => pathname === path;

  const mainLinks = [
    { href: '/', label: 'Home' },
    { href: '/wall', label: 'The Wall' },
    { href: '/share', label: 'Share' },
  ];

  const moreLinks = [
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/stories', label: 'Stories' },
    { href: '/about', label: 'About' },
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
  ];

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        <Link href="/" className="header__logo" aria-label="The Worst Said — Home">
          The Worst <span>Said.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav" aria-label="Main navigation">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`header__link ${isActive(link.href) ? 'header__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="dropdown">
            <button className="header__link dropdown__trigger" aria-expanded="false" aria-haspopup="true">
              More
              <svg className="dropdown__arrow" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="dropdown__menu" role="menu">
              {moreLinks.map((link) => (
                <Link key={link.href} href={link.href} className="dropdown__item" role="menuitem">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span style={mobileOpen ? { background: 'transparent' } : {}} />
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${mobileOpen ? 'mobile-nav--open' : ''}`} aria-label="Mobile navigation">
        {mainLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`mobile-nav__link ${isActive(link.href) ? 'mobile-nav__link--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
        <div className="mobile-nav__divider" />
        <span className="mobile-nav__label">More</span>
        {moreLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`mobile-nav__link ${isActive(link.href) ? 'mobile-nav__link--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

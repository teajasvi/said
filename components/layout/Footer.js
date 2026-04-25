import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  const links = [
    { href: '/wall', label: 'The Wall' },
    { href: '/share', label: 'Share' },
    { href: '/stories', label: 'Stories' },
    { href: '/about', label: 'About' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">The Worst Said.</div>
        </div>
        <nav className="footer__nav" aria-label="Footer navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="footer__link">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="footer__bottom">
        <p className="footer__copy">&copy; {year} The Worst Said</p>
        <p className="footer__copy">Words matter.</p>
      </div>
    </footer>
  );
}

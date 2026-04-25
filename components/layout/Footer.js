import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">The Worst Said.</div>
          <p className="footer__desc">
            A space for the words that stayed with us — the ones we said and the ones we carry.
          </p>
        </div>
        <div>
          <h3 className="footer__heading">Navigate</h3>
          <div className="footer__links">
            <Link href="/" className="footer__link">Home</Link>
            <Link href="/wall" className="footer__link">The Wall</Link>
            <Link href="/share" className="footer__link">Share Yours</Link>
            <Link href="/stories" className="footer__link">Stories</Link>
          </div>
        </div>
        <div>
          <h3 className="footer__heading">Info</h3>
          <div className="footer__links">
            <Link href="/how-it-works" className="footer__link">How It Works</Link>
            <Link href="/about" className="footer__link">About</Link>
            <Link href="/terms" className="footer__link">Terms of Use</Link>
            <Link href="/privacy" className="footer__link">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p className="footer__copy">&copy; {year} The Worst Said. All rights reserved.</p>
        <p className="footer__copy">Words matter.</p>
      </div>
    </footer>
  );
}

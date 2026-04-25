import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="info-page text-center" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <p className="heading-sm">404</p>
      <h1 style={{ marginTop: '8px', marginBottom: '12px' }}>Page Not Found</h1>
      <p className="body-lg" style={{ marginBottom: '32px' }}>The words you&apos;re looking for aren&apos;t here.</p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="btn btn-primary">Go Home</Link>
        <Link href="/wall" className="btn btn-secondary">Read The Wall</Link>
      </div>
    </div>
  );
}

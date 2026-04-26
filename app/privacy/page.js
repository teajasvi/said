export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for The Worst Said — how we handle your data and protect your anonymity.',
  alternates: { canonical: 'https://theworstsaid.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="info-page">
      <p className="heading-sm">Legal</p>
      <h1 style={{ marginTop: '8px' }}>Privacy Policy</h1>
      <p className="subtitle">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

      <div className="prose" style={{ maxWidth: '100%' }}>
        <p>Your privacy is fundamental to The Worst Said. This policy explains what data we collect and how we use it.</p>

        <h2>1. Data We Collect</h2>
        <p><strong>Submission content:</strong> The text you submit and the tag you select.</p>
        <p><strong>Cookies:</strong> We use essential cookies only (no tracking or advertising cookies).</p>

        <h2>2. Data We Do NOT Collect</h2>
        <ul>
          <li>Names, emails, or account information</li>
          <li>Device fingerprints</li>
          <li>Third-party tracking data</li>
          <li>Personally identifiable information of any kind</li>
        </ul>

        <h2>3. How We Use Your Data</h2>
        <ul>
          <li><strong>Submissions:</strong> Displayed anonymously on the site after manual review</li>
          <li><strong>Anti-abuse:</strong> Basic measures are in place to prevent spam and misuse</li>
        </ul>

        <h2>4. Data Storage</h2>
        <p>Data is stored securely with encryption in transit and at rest. All connections use TLS.</p>

        <h2>5. Data Retention</h2>
        <p>Approved submissions are retained indefinitely as part of the public archive. Rejected submissions are periodically deleted.</p>

        <h2>6. Your Rights</h2>
        <p>Since submissions are anonymous, we cannot link specific submissions to specific users. If you need a submission removed, contact us with the exact text and we will review the request.</p>

        <h2>7. Third-Party Services</h2>
        <p>We use standard web infrastructure services for hosting, security, and performance. Each has its own privacy policy. We do not share your data with any third parties for advertising or analytics purposes.</p>

        <h2>8. Changes</h2>
        <p>We may update this policy. Changes will be reflected on this page with an updated date.</p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for The Worst Said — guidelines for using our anonymous submission platform.',
  alternates: { canonical: 'https://theworstsaid.com/terms' },
};

export default function TermsPage() {
  return (
    <div className="info-page">
      <p className="heading-sm">Legal</p>
      <h1 style={{ marginTop: '8px' }}>Terms of Use</h1>
      <p className="subtitle">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

      <div className="prose" style={{ maxWidth: '100%' }}>
        <p>By accessing and using The Worst Said (&quot;the Site&quot;), you agree to the following terms.</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By using this site, you confirm that you are at least 13 years of age and agree to comply with these terms. If you do not agree, please do not use the site.</p>

        <h2>2. User Submissions</h2>
        <p>All submissions are anonymous. By submitting content, you grant The Worst Said a non-exclusive, worldwide, royalty-free license to display, distribute, and use your submission on the platform. You retain any rights you may have to the content.</p>
        <p>You agree not to submit content that:</p>
        <ul>
          <li>Contains personal identifying information (names, addresses, phone numbers)</li>
          <li>Constitutes a direct threat of violence</li>
          <li>Contains illegal content</li>
          <li>Attempts to inject malicious code</li>
        </ul>

        <h2>3. Content Moderation</h2>
        <p>All submissions are reviewed before publication. We reserve the right to reject, remove, or modify any submission at our sole discretion without notice.</p>

        <h2>4. Rate Limits</h2>
        <p>To maintain quality and prevent abuse, users are limited to 6 submissions per 24-hour period. Users who violate our terms may be permanently restricted.</p>

        <h2>5. Disclaimer</h2>
        <p>The site is provided &quot;as is&quot; without warranties of any kind. We are not responsible for the content submitted by users. The Worst Said does not provide professional advice, therapy, or counseling.</p>

        <h2>6. Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, The Worst Said shall not be liable for any damages arising from your use of the site.</p>

        <h2>7. Changes to Terms</h2>
        <p>We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the updated terms.</p>

        <h2>8. Contact</h2>
        <p>For questions about these terms, reach out via the contact information on our About page.</p>
      </div>
    </div>
  );
}

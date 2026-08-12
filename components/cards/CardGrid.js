import SubmissionCard from './SubmissionCard';

/** Single-column submission list */
export default function CardGrid({ submissions, startIndex = 0 }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center" style={{ padding: '80px 0' }}>
        <p className="heading-md">Nothing here yet.</p>
        <p className="body-sm" style={{ marginTop: '8px' }}>The void awaits its first words.</p>
      </div>
    );
  }

  return (
    <div className="confession-list">
      {submissions.map((sub, i) => (
        <SubmissionCard
          key={sub.id}
          text={sub.text}
          createdAt={sub.created_at}
          saidBy={sub.said_by}
          index={startIndex + i}
        />
      ))}
    </div>
  );
}

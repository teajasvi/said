import SubmissionCard from './SubmissionCard';

/** Desktop card grid — auto-fill responsive grid */
export default function CardGrid({ submissions, startIndex = 0 }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center" style={{ padding: '64px 0' }}>
        <p className="body-lg">No submissions yet. Be the first to share.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Grid */}
      <div className="desktop-only">
        <div className="card-grid-desktop">
          {submissions.map((sub, i) => (
            <SubmissionCard
              key={sub.id}
              text={sub.text}
              tag={sub.tag}
              createdAt={sub.created_at}
              index={startIndex + i}
            />
          ))}
        </div>
      </div>

      {/* Mobile Grid */}
      <div className="mobile-only">
        <div className="card-grid-mobile">
          {submissions.map((sub, i) => (
            <SubmissionCard
              key={sub.id}
              text={sub.text}
              tag={sub.tag}
              createdAt={sub.created_at}
              index={startIndex + i}
            />
          ))}
        </div>
      </div>
    </>
  );
}

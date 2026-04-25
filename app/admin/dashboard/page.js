'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?status=${statusFilter}&page=${page}`);
      if (res.status === 401) { router.push('/admin'); return; }
      const data = await res.json();
      setSubmissions(data.submissions || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch { router.push('/admin'); }
    setLoading(false);
  }, [statusFilter, page, router]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      fetchSubmissions();
    } catch (err) { console.error(err); }
    setActionLoading(null);
  };

  const handleBulkApprove = async () => {
    const ids = submissions.map(s => s.id);
    if (!ids.length) return;
    if (!confirm(`Approve all ${ids.length} pending submissions on this page?`)) return;
    setActionLoading('bulk-approve');
    try {
      await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ids, action: 'approve' }),
      });
      fetchSubmissions();
    } catch (err) { console.error(err); }
    setActionLoading(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this submission permanently?')) return;
    setActionLoading(id);
    try {
      await fetch('/api/admin/submissions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchSubmissions();
    } catch (err) { console.error(err); }
    setActionLoading(null);
  };

  const handleBan = async (sub) => {
    if (!confirm(`Ban user ${sub.user_uuid?.slice(0, 8)}...?`)) return;
    try {
      await fetch('/api/admin/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ip_address: sub.ip_address,
          user_uuid: sub.user_uuid,
          reason: 'Banned from admin panel',
        }),
      });
      alert('User banned.');
    } catch (err) { console.error(err); }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  const formatDate = (d) => new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  const tagLabel = (t) => t === 'i_said_it' ? 'I said it' : 'Said to me';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Admin Header */}
      <div style={{ background: 'var(--text-primary)', color: 'var(--card-text)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>The Worst Said — Admin</div>
        <button onClick={handleLogout} className="btn" style={{ color: 'var(--card-text-muted)', fontSize: '0.8125rem' }}>
          Sign Out
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div style={{ padding: '20px 24px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', flex: '1', minWidth: '140px' }}>
            <div className="caption">Current View</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '4px' }}>{total}</div>
          </div>
        </div>

        {/* Filter and Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`filter-tab ${statusFilter === s ? 'filter-tab--active' : ''}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {statusFilter === 'pending' && submissions.length > 0 && (
            <button
              onClick={handleBulkApprove}
              disabled={actionLoading === 'bulk-approve'}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
            >
              {actionLoading === 'bulk-approve' ? 'Approving...' : 'Approve All on Page'}
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : submissions.length === 0 ? (
          <div className="text-center" style={{ padding: '64px 0' }}>
            <p className="body-lg">No {statusFilter} submissions.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Text</th>
                    <th>Tag</th>
                    <th>Date</th>
                    <th>IP</th>
                    <th>UUID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id}>
                      <td style={{ maxWidth: '300px', wordBreak: 'break-word' }}>{sub.text}</td>
                      <td><span className={`badge badge--${sub.status}`}>{tagLabel(sub.tag)}</span></td>
                      <td className="caption">{formatDate(sub.created_at)}</td>
                      <td className="caption" style={{ fontFamily: 'monospace' }}>{sub.ip_address}</td>
                      <td className="caption" style={{ fontFamily: 'monospace' }}>{sub.user_uuid?.slice(0, 12)}...</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {statusFilter === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAction(sub.id, 'approve')}
                                className="btn btn-ghost"
                                disabled={actionLoading === sub.id}
                                style={{ color: 'var(--success)', fontSize: '0.75rem', padding: '4px 10px' }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(sub.id, 'reject')}
                                className="btn btn-ghost"
                                disabled={actionLoading === sub.id}
                                style={{ color: 'var(--error)', fontSize: '0.75rem', padding: '4px 10px' }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleBan(sub)}
                            className="btn btn-ghost"
                            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                          >
                            Ban
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="btn btn-ghost"
                            disabled={actionLoading === sub.id}
                            style={{ color: 'var(--error)', fontSize: '0.75rem', padding: '4px 10px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination" style={{ marginTop: '24px' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="pagination__btn"
                >
                  ←
                </button>
                <span className="body-sm" style={{ margin: '0 16px' }}>Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="pagination__btn"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

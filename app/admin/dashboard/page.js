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
  const [selected, setSelected] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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
    setSelected(new Set());
  }, [statusFilter, page, router]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  // === Actions ===
  const ADMIN_PIN = '2000';
  const verifyPin = () => {
    const pin = prompt('Enter admin PIN to confirm:');
    return pin === ADMIN_PIN;
  };

  const handleAction = async (id, action) => {
    if (action === 'reject' && !verifyPin()) return;
    setActionLoading(id);
    try {
      await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      showToast(`Submission ${action}d`);
      fetchSubmissions();
    } catch (err) { showToast('Action failed', 'error'); }
    setActionLoading(null);
  };

  const handleBulkAction = async (action) => {
    const ids = [...selected];
    if (!ids.length) return;
    if ((action === 'reject' || action === 'delete') && !verifyPin()) return;
    const label = action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : 'Delete';
    if (!confirm(`${label} ${ids.length} selected submission${ids.length > 1 ? 's' : ''}?`)) return;
    setActionLoading('bulk');
    try {
      if (action === 'delete') {
        await fetch('/api/admin/submissions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: ids }),
        });
      } else {
        await fetch('/api/admin/submissions', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: ids, action }),
        });
      }
      showToast(`${ids.length} submission${ids.length > 1 ? 's' : ''} ${action === 'delete' ? 'deleted' : action + 'd'}`);
      fetchSubmissions();
    } catch (err) { showToast('Bulk action failed', 'error'); }
    setActionLoading(null);
  };

  const handleDelete = async (id) => {
    if (!verifyPin()) return;
    if (!confirm('Delete this submission permanently?')) return;
    setActionLoading(id);
    try {
      await fetch('/api/admin/submissions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      showToast('Submission deleted');
      fetchSubmissions();
    } catch (err) { showToast('Delete failed', 'error'); }
    setActionLoading(null);
  };

  const handleBan = async (sub) => {
    if (!verifyPin()) return;
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
      showToast('User banned');
    } catch (err) { showToast('Ban failed', 'error'); }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  // === Helpers ===
  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const filtered = filteredSubmissions;
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(s => s.id)));
    }
  };

  const formatDate = (d) => new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  const tagLabel = (t) => t === 'i_said_it' ? 'I said it' : 'Said to me';

  const countryFlag = (code) => {
    if (!code || code.length !== 2) return '';
    return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
  };

  const filteredSubmissions = search
    ? submissions.filter(s => s.text.toLowerCase().includes(search.toLowerCase()))
    : submissions;

  const allSelected = filteredSubmissions.length > 0 && selected.size === filteredSubmissions.length;

  // === Styles ===
  const s = {
    page: { minHeight: '100vh', background: '#111110', color: '#E8E6E3' },
    header: { background: '#1A1918', borderBottom: '1px solid #2A2927', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', color: '#E8E6E3' },
    signOut: { color: '#8A8885', fontSize: '0.8125rem', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--font-sans)' },
    container: { maxWidth: '1320px', margin: '0 auto', padding: '20px 16px' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' },
    stat: { padding: '12px 10px', background: '#1A1918', borderRadius: '8px', border: '1px solid #2A2927', textAlign: 'center' },
    statLabel: { fontSize: '0.5625rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B6966', fontWeight: '500' },
    statValue: { fontSize: '1.125rem', fontWeight: '600', marginTop: '2px', color: '#E8E6E3' },
    tabs: { display: 'flex', gap: '4px' },
    tab: (active) => ({ padding: '7px 14px', fontSize: '0.8125rem', fontWeight: '500', border: '1px solid ' + (active ? '#E8E6E3' : '#2A2927'), borderRadius: '6px', background: active ? '#E8E6E3' : 'transparent', color: active ? '#111110' : '#8A8885', cursor: 'pointer', fontFamily: 'var(--font-sans)', flex: '1', textAlign: 'center' }),
    searchInput: { width: '100%', padding: '8px 12px 8px 32px', fontSize: '0.8125rem', background: '#1A1918', border: '1px solid #2A2927', borderRadius: '6px', color: '#E8E6E3', outline: 'none', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' },
    bulkBar: { display: 'flex', gap: '6px', alignItems: 'center', padding: '10px 14px', background: '#1E1D1C', borderRadius: '8px', marginBottom: '12px', border: '1px solid #2A2927', flexWrap: 'wrap' },
    bulkCount: { fontSize: '0.8125rem', color: '#E8E6E3', fontWeight: '500', marginRight: 'auto' },
    bulkBtn: (color) => ({ padding: '5px 12px', fontSize: '0.75rem', fontWeight: '500', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-sans)', background: color === 'green' ? '#1B4332' : color === 'red' ? '#3B1219' : '#2A2927', color: color === 'green' ? '#6EE7B7' : color === 'red' ? '#FCA5A5' : '#E8E6E3' }),
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '10px 14px', fontSize: '0.6875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6B6966', borderBottom: '1px solid #2A2927', background: '#1A1918' },
    td: { padding: '12px 14px', fontSize: '0.8125rem', borderBottom: '1px solid #1E1D1C', verticalAlign: 'top', color: '#C8C6C3' },
    tableWrap: { overflowX: 'auto', background: '#151413', borderRadius: '10px', border: '1px solid #2A2927' },
    checkbox: { width: '16px', height: '16px', accentColor: '#E8E6E3', cursor: 'pointer' },
    textCell: { maxWidth: '360px', wordBreak: 'break-word', cursor: 'pointer', lineHeight: '1.5' },
    expandedText: { maxWidth: '360px', wordBreak: 'break-word', lineHeight: '1.6' },
    badge: (tag) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6875rem', fontWeight: '500', background: tag === 'i_said_it' ? '#1B4332' : '#1E293B', color: tag === 'i_said_it' ? '#6EE7B7' : '#93C5FD' }),
    mono: { fontFamily: 'monospace', fontSize: '0.6875rem', color: '#6B6966' },
    actionBtn: (color) => ({ padding: '6px 12px', fontSize: '0.6875rem', fontWeight: '500', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-sans)', background: color === 'green' ? '#1B4332' : color === 'red' ? '#3B1219' : color === 'orange' ? '#422006' : '#2A2927', color: color === 'green' ? '#6EE7B7' : color === 'red' ? '#FCA5A5' : color === 'orange' ? '#FCD34D' : '#E8E6E3' }),
    card: (sel) => ({ background: sel ? '#1E1D1C' : '#151413', border: '1px solid #2A2927', borderRadius: '10px', padding: '14px', marginBottom: '8px' }),
    pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px' },
    pageBtn: (active) => ({ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontSize: '0.8125rem', border: 'none', background: active ? '#E8E6E3' : '#1A1918', color: active ? '#111110' : '#8A8885', cursor: 'pointer', fontFamily: 'var(--font-sans)' }),
    empty: { padding: '80px 0', textAlign: 'center', color: '#6B6966', fontSize: '0.9375rem' },
    toastWrap: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 },
    toast: (type) => ({ padding: '12px 20px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: '500', background: type === 'error' ? '#3B1219' : '#1B4332', color: type === 'error' ? '#FCA5A5' : '#6EE7B7', border: '1px solid ' + (type === 'error' ? '#5C1D2E' : '#2D6A4F'), boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }),
  };

  const renderCard = (sub) => (
    <div key={sub.id} style={s.card(selected.has(sub.id))}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <input type="checkbox" checked={selected.has(sub.id)} onChange={() => toggleSelect(sub.id)} style={s.checkbox} />
        <span style={s.badge(sub.tag)}>{tagLabel(sub.tag)}</span>
        <span style={{ ...s.mono, marginLeft: 'auto' }}>{formatDate(sub.created_at)}</span>
      </div>
      <div
        style={expandedId === sub.id
          ? { fontSize: '0.875rem', lineHeight: '1.6', color: '#C8C6C3', wordBreak: 'break-word', marginBottom: '10px' }
          : { fontSize: '0.875rem', lineHeight: '1.6', color: '#C8C6C3', wordBreak: 'break-word', marginBottom: '10px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }
        }
        onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
      >
        {sub.text}
      </div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '10px', fontSize: '0.6875rem', color: '#6B6966', fontFamily: 'monospace', flexWrap: 'wrap' }}>
        {sub.country && sub.country !== 'XX' && <span>{countryFlag(sub.country)}</span>}
        <span>{sub.ip_address}</span>
        <span>·</span>
        <span>{sub.user_uuid?.slice(0, 10)}…</span>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {statusFilter === 'pending' && (
          <>
            <button onClick={() => handleAction(sub.id, 'approve')} disabled={actionLoading === sub.id} style={s.actionBtn('green')}>✓ Approve</button>
            <button onClick={() => handleAction(sub.id, 'reject')} disabled={actionLoading === sub.id} style={s.actionBtn('red')}>✕ Reject</button>
          </>
        )}
        <button onClick={() => handleBan(sub)} style={s.actionBtn('orange')}>Ban</button>
        <button onClick={() => handleDelete(sub.id)} disabled={actionLoading === sub.id} style={s.actionBtn('red')}>Delete</button>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.headerTitle}>Admin</div>
        <button onClick={handleLogout} style={s.signOut}>Sign Out</button>
      </div>

      <div style={s.container}>
        <div style={s.statsRow}>
          <div style={s.stat}><div style={s.statLabel}>Total</div><div style={s.statValue}>{total}</div></div>
          <div style={s.stat}><div style={s.statLabel}>Status</div><div style={{ ...s.statValue, fontSize: '0.8125rem', textTransform: 'capitalize' }}>{statusFilter}</div></div>
          <div style={s.stat}><div style={s.statLabel}>Page</div><div style={s.statValue}>{page}/{totalPages}</div></div>
          <div style={s.stat}><div style={s.statLabel}>Sel</div><div style={s.statValue}>{selected.size}</div></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <div style={s.tabs}>
            {['pending', 'approved', 'rejected'].map((f) => (
              <button key={f} onClick={() => { setStatusFilter(f); setPage(1); setSearch(''); }} style={s.tab(statusFilter === f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6B6966', fontSize: '0.75rem' }}>🔍</span>
            <input style={s.searchInput} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {selected.size > 0 && (
          <div style={s.bulkBar}>
            <span style={s.bulkCount}>{selected.size} selected</span>
            {statusFilter === 'pending' && (
              <>
                <button onClick={() => handleBulkAction('approve')} style={s.bulkBtn('green')} disabled={actionLoading === 'bulk'}>✓ Approve</button>
                <button onClick={() => handleBulkAction('reject')} style={s.bulkBtn('red')} disabled={actionLoading === 'bulk'}>✕ Reject</button>
              </>
            )}
            <button onClick={() => handleBulkAction('delete')} style={s.bulkBtn('red')} disabled={actionLoading === 'bulk'}>🗑 Delete</button>
            <button onClick={() => setSelected(new Set())} style={s.bulkBtn('neutral')}>Clear</button>
          </div>
        )}

        {loading ? (
          <div style={s.empty}><div className="spinner" style={{ margin: '0 auto', borderColor: '#2A2927', borderTopColor: '#E8E6E3' }} /></div>
        ) : filteredSubmissions.length === 0 ? (
          <div style={s.empty}>No {statusFilter} submissions{search ? ` matching "${search}"` : ''}.</div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="mobile-only">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} style={s.checkbox} />
                <span style={{ fontSize: '0.75rem', color: '#6B6966' }}>Select all</span>
              </div>
              {filteredSubmissions.map(renderCard)}
            </div>

            {/* Desktop Table */}
            <div className="desktop-only">
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} style={s.checkbox} /></th>
                      <th style={s.th}>Submission</th>
                      <th style={s.th}>Tag</th>
                      <th style={s.th}>Date</th>
                      <th style={s.th}>IP / UUID</th>
                      <th style={s.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} style={{ background: selected.has(sub.id) ? '#1E1D1C' : 'transparent' }}>
                        <td style={s.td}><input type="checkbox" checked={selected.has(sub.id)} onChange={() => toggleSelect(sub.id)} style={s.checkbox} /></td>
                        <td style={s.td}>
                          <div
                            style={expandedId === sub.id ? s.expandedText : { ...s.textCell, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
                            onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                          >{sub.text}</div>
                        </td>
                        <td style={s.td}><span style={s.badge(sub.tag)}>{tagLabel(sub.tag)}</span></td>
                        <td style={{ ...s.td, whiteSpace: 'nowrap' }}><span style={s.mono}>{formatDate(sub.created_at)}</span></td>
                        <td style={s.td}>
                          <div style={s.mono}>
                            {sub.country && sub.country !== 'XX' && <span style={{ marginRight: '4px' }}>{countryFlag(sub.country)}</span>}
                            {sub.ip_address}
                          </div>
                          <div style={{ ...s.mono, marginTop: '2px' }}>{sub.user_uuid?.slice(0, 12)}…</div>
                        </td>
                        <td style={s.td}>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {statusFilter === 'pending' && (
                              <>
                                <button onClick={() => handleAction(sub.id, 'approve')} disabled={actionLoading === sub.id} style={s.actionBtn('green')}>Approve</button>
                                <button onClick={() => handleAction(sub.id, 'reject')} disabled={actionLoading === sub.id} style={s.actionBtn('red')}>Reject</button>
                              </>
                            )}
                            <button onClick={() => handleBan(sub)} style={s.actionBtn('orange')}>Ban</button>
                            <button onClick={() => handleDelete(sub.id)} disabled={actionLoading === sub.id} style={s.actionBtn('red')}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div style={s.pagination}>
                <button onClick={() => setPage(1)} disabled={page <= 1} style={s.pageBtn(false)}>«</button>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={s.pageBtn(false)}>‹</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let n;
                  if (totalPages <= 5) n = i + 1;
                  else if (page <= 3) n = i + 1;
                  else if (page >= totalPages - 2) n = totalPages - 4 + i;
                  else n = page - 2 + i;
                  return <button key={n} onClick={() => setPage(n)} style={s.pageBtn(page === n)}>{n}</button>;
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={s.pageBtn(false)}>›</button>
                <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} style={s.pageBtn(false)}>»</button>
              </div>
            )}
          </>
        )}
      </div>

      {toast && (
        <div style={s.toastWrap}>
          <div style={s.toast(toast.type)}>{toast.msg}</div>
        </div>
      )}
    </div>
  );
}

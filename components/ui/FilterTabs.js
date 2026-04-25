'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'i_said_it', label: 'I Said It' },
  { value: 'said_to_me', label: 'Said To Me' },
];

export default function FilterTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';

  const handleFilter = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', value);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="filter-tabs" role="tablist" aria-label="Filter submissions">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => handleFilter(f.value)}
          className={`filter-tab ${activeFilter === f.value ? 'filter-tab--active' : ''}`}
          role="tab"
          aria-selected={activeFilter === f.value}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

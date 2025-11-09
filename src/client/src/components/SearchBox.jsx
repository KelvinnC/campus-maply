import React, { useEffect, useRef, useState } from 'react';

const SearchBox = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setError('');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const resp = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!resp.ok) throw new Error('Search failed');
        const data = await resp.json();
        setResults(data);
        setOpen(true);
      } catch (e) {
        setError(e.message || 'Search error');
        setResults([]);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (item) => {
    try { console.log('[SearchBox] select', item); } catch {}
    setOpen(false);
    if (onSelect) onSelect(item);
  };

  return (
    <div className="searchbox">
      <input
        type="text"
        placeholder="Search buildings, rooms, or businesses"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        aria-label="Search buildings, rooms, or businesses"
      />
      {open && (
        <div className="search-results" role="listbox">
          {loading && <div className="search-status">Searching…</div>}
          {error && !loading && <div className="search-error">{error}</div>}
          {!loading && !error && results.length === 0 && (
            <div className="search-status">No results</div>
          )}
          {!loading && !error && results.map((r) => (
            <button
              key={`${r.type}-${r.id}`}
              className="search-item"
              onClick={() => handleSelect(r)}
            >
              {r.type === 'building' && (
                <>
                  <span className="badge">Building</span>
                  <span className="primary">{r.name}</span>
                  {r.code && <span className="secondary">{r.code}</span>}
                </>
              )}
              {r.type === 'room' && (
                <>
                  <span className="badge">Room</span>
                  <span className="primary">{r.building_code} {r.room_number}</span>
                  <span className="secondary">{r.building_name}</span>
                </>
              )}
              {r.type === 'business' && (
                <>
                  <span className="badge">Business</span>
                  <span className="primary">{r.name}</span>
                  <span className="secondary">{r.category}{r.building_code ? ` • ${r.building_code}` : ''}</span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;


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
    setOpen(false);
    onSelect && onSelect(item);
  };

  return (
    <div className="searchbox">
      <input
        type="text"
        placeholder="Search buildings or rooms (e.g., EME or 312)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        aria-label="Search buildings or rooms"
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
              {r.type === 'building' ? (
                <>
                  <span className="badge">Building</span>
                  <span className="primary">{r.name}</span>
                  {r.code && <span className="secondary">{r.code}</span>}
                </>
              ) : (
                <>
                  <span className="badge">Room</span>
                  <span className="primary">{r.building_code} {r.room_number}</span>
                  <span className="secondary">{r.building_name}</span>
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


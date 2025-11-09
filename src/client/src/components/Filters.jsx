import { useState, useRef, useEffect } from 'react';

export default function Filters({
  buildingEnabled,
  parkingEnabled,
  onBuildingChange,
  onParkingChange,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBuilding = (e) => {
    onBuildingChange && onBuildingChange(e.target.checked);
  };
  const handleParking = (e) => {
    onParkingChange && onParkingChange(e.target.checked);
  };

  return (
    <div className="filters-control" ref={wrapperRef}>
      <button
        type="button"
        className="filter-button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        Filters
      </button>
      {open && (
        <div className="filters-popover" role="menu">
          <label className="filter">
            <input
              type="checkbox"
              checked={!!buildingEnabled}
              onChange={handleBuilding}
            />
            Buildings
          </label>
          <label className="filter">
            <input
              type="checkbox"
              checked={!!parkingEnabled}
              onChange={handleParking}
            />
            Parking
          </label>
        </div>
      )}
    </div>
  );
}

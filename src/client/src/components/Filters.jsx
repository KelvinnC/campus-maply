import { useState, useRef, useEffect } from 'react';

export default function Filters({
  buildingEnabled,
  parkingEnabled,
  businessEnabled,
  categories = [],
  selectedCategories = [],
  onBuildingChange,
  onParkingChange,
  onBusinessChange,
  onCategoryToggle,
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
  const handleBusiness = (e) => {
    onBusinessChange && onBusinessChange(e.target.checked);
  };
  const handleCategory = (category) => (e) => {
    onCategoryToggle && onCategoryToggle(category, e.target.checked);
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
          <label className="filter">
            <input
              type="checkbox"
              checked={!!businessEnabled}
              onChange={handleBusiness}
            />
            Businesses (All)
          </label>
          {Array.isArray(categories) && categories.length > 0 && (
            <div className="biz-categories" role="group" aria-label="Business categories">
              {categories.map((cat) => {
                const isChecked = Array.isArray(selectedCategories)
                  ? selectedCategories.includes(cat)
                  : !!selectedCategories?.has?.(cat);
                return (
                  <label key={cat} className="filter">
                    <input
                      type="checkbox"
                      checked={!!isChecked}
                      onChange={handleCategory(cat)}
                    />
                    {cat}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

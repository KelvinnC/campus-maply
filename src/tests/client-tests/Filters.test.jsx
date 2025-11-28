/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from '../../client/src/components/Filters.jsx';

describe('Filters Component', () => {
  const defaultProps = {
    buildingEnabled: true,
    parkingEnabled: true,
    businessEnabled: true,
    categories: ['Restaurant', 'Retail'],
    selectedCategories: ['Restaurant', 'Retail'],
    onBuildingChange: vi.fn(),
    onParkingChange: vi.fn(),
    onBusinessChange: vi.fn(),
    onCategoryToggle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Filter Button', () => {
    it('should render the Filters button', () => {
      render(<Filters {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
    });

    it('should open popover when clicked', () => {
      render(<Filters {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /filters/i });
      fireEvent.click(button);
      
      expect(screen.getByText('Buildings')).toBeInTheDocument();
      expect(screen.getByText('Parking')).toBeInTheDocument();
      expect(screen.getByText('Businesses (All)')).toBeInTheDocument();
    });

    it('should close popover when clicked again', () => {
      render(<Filters {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /filters/i });
      fireEvent.click(button); // Open
      fireEvent.click(button); // Close
      
      expect(screen.queryByText('Buildings')).not.toBeInTheDocument();
    });
  });

  describe('Filter Checkboxes', () => {
    it('should render building checkbox as checked when enabled', () => {
      render(<Filters {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /filters/i }));
      
      const buildingCheckbox = screen.getByRole('checkbox', { name: /buildings/i });
      expect(buildingCheckbox).toBeChecked();
    });

    it('should render building checkbox as unchecked when disabled', () => {
      render(<Filters {...defaultProps} buildingEnabled={false} />);
      
      fireEvent.click(screen.getByRole('button', { name: /filters/i }));
      
      const buildingCheckbox = screen.getByRole('checkbox', { name: /buildings/i });
      expect(buildingCheckbox).not.toBeChecked();
    });

    it('should call onBuildingChange when building checkbox is toggled', () => {
      render(<Filters {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /filters/i }));
      
      const buildingCheckbox = screen.getByRole('checkbox', { name: /buildings/i });
      fireEvent.click(buildingCheckbox);
      
      expect(defaultProps.onBuildingChange).toHaveBeenCalledWith(false);
    });

    it('should call onParkingChange when parking checkbox is toggled', () => {
      render(<Filters {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /filters/i }));
      
      const parkingCheckbox = screen.getByRole('checkbox', { name: /parking/i });
      fireEvent.click(parkingCheckbox);
      
      expect(defaultProps.onParkingChange).toHaveBeenCalledWith(false);
    });

    it('should call onBusinessChange when business checkbox is toggled', () => {
      render(<Filters {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /filters/i }));
      
      const businessCheckbox = screen.getByRole('checkbox', { name: /businesses/i });
      fireEvent.click(businessCheckbox);
      
      expect(defaultProps.onBusinessChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Category Filters', () => {
    it('should render category checkboxes', () => {
      render(<Filters {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /filters/i }));
      
      expect(screen.getByRole('checkbox', { name: /restaurant/i })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /retail/i })).toBeInTheDocument();
    });

    it('should call onCategoryToggle when category is toggled', () => {
      render(<Filters {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /filters/i }));
      
      const restaurantCheckbox = screen.getByRole('checkbox', { name: /restaurant/i });
      fireEvent.click(restaurantCheckbox);
      
      expect(defaultProps.onCategoryToggle).toHaveBeenCalledWith('Restaurant', false);
    });

    it('should not render categories when empty', () => {
      render(<Filters {...defaultProps} categories={[]} />);
      
      fireEvent.click(screen.getByRole('button', { name: /filters/i }));
      
      // Should still show main filters but not category section
      expect(screen.getByText('Buildings')).toBeInTheDocument();
      expect(screen.queryByRole('group', { name: /business categories/i })).not.toBeInTheDocument();
    });
  });

  describe('Click Outside', () => {
    it('should close popover when clicking outside', () => {
      render(
        <div>
          <div data-testid="outside">Outside</div>
          <Filters {...defaultProps} />
        </div>
      );
      
      fireEvent.click(screen.getByRole('button', { name: /filters/i }));
      expect(screen.getByText('Buildings')).toBeInTheDocument();
      
      fireEvent.mouseDown(screen.getByTestId('outside'));
      
      expect(screen.queryByText('Buildings')).not.toBeInTheDocument();
    });
  });
});


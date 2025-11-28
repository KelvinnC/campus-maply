/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBox from '../../client/src/components/SearchBox.jsx';

describe('SearchBox Component', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockReset();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render search input', () => {
      render(<SearchBox onSelect={mockOnSelect} />);
      
      const input = screen.getByPlaceholderText(/search buildings, rooms, businesses/i);
      expect(input).toBeInTheDocument();
    });

    it('should have correct aria-label', () => {
      render(<SearchBox onSelect={mockOnSelect} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Search buildings, rooms, businesses, or parking lots');
    });
  });

  describe('Search Functionality', () => {
    it('should not show results for empty query', async () => {
      render(<SearchBox onSelect={mockOnSelect} />);
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should display search results after debounce', async () => {
      const mockResults = [
        { type: 'building', id: 1, name: 'Engineering Building', code: 'EME' },
      ];
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults),
      });

      render(<SearchBox onSelect={mockOnSelect} />);
      
      const input = screen.getByRole('textbox');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'EME' } });
        // Wait for debounce (250ms)
        vi.advanceTimersByTime(300);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Engineering Building')).toBeInTheDocument();
      });
    });

    it('should display "No results" when search returns empty', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      render(<SearchBox onSelect={mockOnSelect} />);
      
      const input = screen.getByRole('textbox');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'xyz' } });
        vi.advanceTimersByTime(300);
      });
      
      await waitFor(() => {
        expect(screen.getByText('No results')).toBeInTheDocument();
      });
    });
  });

  describe('Result Types', () => {
    it('should display building results with badge', async () => {
      const mockResults = [
        { type: 'building', id: 1, name: 'Engineering Building', code: 'EME' },
      ];
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults),
      });

      render(<SearchBox onSelect={mockOnSelect} />);
      
      const input = screen.getByRole('textbox');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'EME' } });
        vi.advanceTimersByTime(300);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Building')).toBeInTheDocument();
        expect(screen.getByText('EME')).toBeInTheDocument();
      });
    });

    it('should display room results with badge', async () => {
      const mockResults = [
        { type: 'room', id: 1, room_number: '101', building_code: 'EME', building_name: 'Engineering' },
      ];
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults),
      });

      render(<SearchBox onSelect={mockOnSelect} />);
      
      const input = screen.getByRole('textbox');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: '101' } });
        vi.advanceTimersByTime(300);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Room')).toBeInTheDocument();
        expect(screen.getByText('EME 101')).toBeInTheDocument();
      });
    });

    it('should display business results with badge', async () => {
      const mockResults = [
        { type: 'business', id: 1, name: 'Test Cafe', category: 'Restaurant', building_code: 'EME' },
      ];
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults),
      });

      render(<SearchBox onSelect={mockOnSelect} />);
      
      const input = screen.getByRole('textbox');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'cafe' } });
        vi.advanceTimersByTime(300);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Business')).toBeInTheDocument();
        expect(screen.getByText('Test Cafe')).toBeInTheDocument();
      });
    });

    it('should display parking results with badge', async () => {
      const mockResults = [
        { type: 'parking', id: 1, name: 'Parking Lot A', description: 'Main parking' },
      ];
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults),
      });

      render(<SearchBox onSelect={mockOnSelect} />);
      
      const input = screen.getByRole('textbox');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'parking' } });
        vi.advanceTimersByTime(300);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Parking')).toBeInTheDocument();
        expect(screen.getByText('Parking Lot A')).toBeInTheDocument();
      });
    });
  });

  describe('Selection', () => {
    it('should call onSelect when result is clicked', async () => {
      const mockResults = [
        { type: 'building', id: 1, name: 'Engineering Building', code: 'EME' },
      ];
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults),
      });

      render(<SearchBox onSelect={mockOnSelect} />);
      
      const input = screen.getByRole('textbox');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'EME' } });
        vi.advanceTimersByTime(300);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Engineering Building')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Engineering Building'));
      
      expect(mockOnSelect).toHaveBeenCalledWith(mockResults[0]);
    });

    it('should close results after selection', async () => {
      const mockResults = [
        { type: 'building', id: 1, name: 'Engineering Building', code: 'EME' },
      ];
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults),
      });

      render(<SearchBox onSelect={mockOnSelect} />);
      
      const input = screen.getByRole('textbox');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'EME' } });
        vi.advanceTimersByTime(300);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Engineering Building')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Engineering Building'));
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on fetch failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
      });

      render(<SearchBox onSelect={mockOnSelect} />);
      
      const input = screen.getByRole('textbox');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'test' } });
        vi.advanceTimersByTime(300);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Search failed')).toBeInTheDocument();
      });
    });
  });
});

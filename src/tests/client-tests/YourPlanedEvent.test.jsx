/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import YourPlanedEvent from '../../client/src/components/YourPlanedEvent.jsx';

describe('YourPlanedEvent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockReset();
  });

  describe('Rendering', () => {
    it('should render the title', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      render(<YourPlanedEvent refreshTrigger={0} />);
      
      expect(screen.getByText('Your Planed Events')).toBeInTheDocument();
      
      // Wait for fetch to complete to avoid act() warnings
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('should show loading state initially', () => {
      global.fetch.mockImplementationOnce(() => 
        new Promise(() => {}) // Never resolves
      );

      const { unmount } = render(<YourPlanedEvent refreshTrigger={0} />);
      
      expect(screen.getByText(/loading events/i)).toBeInTheDocument();
      
      // Cleanup to avoid pending updates
      unmount();
    });
  });

  describe('Events Display', () => {
    it('should display "No events" message when empty', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      render(<YourPlanedEvent refreshTrigger={0} />);
      
      await waitFor(() => {
        expect(screen.getByText(/no events yet/i)).toBeInTheDocument();
      });
    });

    it('should display events when available', async () => {
      const mockEvents = [
        {
          id: 1,
          title: 'Test Event 1',
          start_time: '2025-12-01T10:00:00.000Z',
          booking: { room_number: '101', building_code: 'EME' },
        },
        {
          id: 2,
          title: 'Test Event 2',
          start_time: '2025-12-02T14:00:00.000Z',
          building_name: 'Science Building',
        },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      });

      render(<YourPlanedEvent refreshTrigger={0} />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
        expect(screen.getByText('Test Event 2')).toBeInTheDocument();
      });
    });

    it('should display location from booking', async () => {
      const mockEvents = [
        {
          id: 1,
          title: 'Test Event',
          start_time: '2025-12-01T10:00:00.000Z',
          booking: { room_number: '101', building_code: 'EME' },
        },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      });

      render(<YourPlanedEvent refreshTrigger={0} />);
      
      await waitFor(() => {
        expect(screen.getByText('EME101')).toBeInTheDocument();
      });
    });

    it('should display location from building_name when no booking', async () => {
      const mockEvents = [
        {
          id: 1,
          title: 'Test Event',
          start_time: '2025-12-01T10:00:00.000Z',
          building_name: 'Engineering Building',
        },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      });

      render(<YourPlanedEvent refreshTrigger={0} />);
      
      await waitFor(() => {
        expect(screen.getByText('Engineering Building')).toBeInTheDocument();
      });
    });

    it('should display TBA when no location available', async () => {
      const mockEvents = [
        {
          id: 1,
          title: 'Test Event',
          start_time: '2025-12-01T10:00:00.000Z',
        },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      });

      render(<YourPlanedEvent refreshTrigger={0} />);
      
      await waitFor(() => {
        expect(screen.getByText('TBA')).toBeInTheDocument();
      });
    });
  });

  describe('Refresh Trigger', () => {
    it('should refetch events when refreshTrigger changes', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const { rerender } = render(<YourPlanedEvent refreshTrigger={0} />);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
      
      rerender(<YourPlanedEvent refreshTrigger={1} />);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on fetch failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
      });

      render(<YourPlanedEvent refreshTrigger={0} />);
      
      await waitFor(() => {
        expect(screen.getByText(/error loading events/i)).toBeInTheDocument();
      });
    });

    it('should display error message on network error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<YourPlanedEvent refreshTrigger={0} />);
      
      await waitFor(() => {
        expect(screen.getByText(/error loading events/i)).toBeInTheDocument();
      });
    });
  });
});


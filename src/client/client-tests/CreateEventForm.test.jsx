/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateEventForm from '../src/components/CreateEventForm.jsx';

describe('CreateEventForm Component', () => {
  const mockOnEventCreated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock that handles /api/rooms/available calls
    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/rooms/available')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      // Default response for other endpoints
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
    localStorage.getItem.mockReturnValue(JSON.stringify({ id: 1, email: 'test@test.com' }));
  });

  describe('Rendering', () => {
    it('should render form title', () => {
      render(<CreateEventForm onEventCreated={mockOnEventCreated} />);
      
      expect(screen.getByRole('heading', { name: /create a new event/i })).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(<CreateEventForm onEventCreated={mockOnEventCreated} />);
      
      // Check labels exist
      expect(screen.getByText('Title *')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Date *')).toBeInTheDocument();
      expect(screen.getByText('Start Time *')).toBeInTheDocument();
      expect(screen.getByText('End Time *')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<CreateEventForm onEventCreated={mockOnEventCreated} />);
      
      expect(screen.getByRole('button', { name: /create event/i })).toBeInTheDocument();
    });

    it('should show room selector info when date/time not selected', () => {
      render(<CreateEventForm onEventCreated={mockOnEventCreated} />);
      
      expect(screen.getByText(/fill in date and time to see available rooms/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error message when end time is before start time', async () => {
      render(<CreateEventForm onEventCreated={mockOnEventCreated} />);
      
      // Fill title - find the text input (not textarea)
      const inputs = screen.getAllByRole('textbox');
      const titleInput = inputs.find(input => input.getAttribute('type') === 'text');
      await userEvent.type(titleInput, 'New Event');
      
      // Set date - find by type attribute
      const dateInput = document.querySelector('input[type="date"]');
      fireEvent.change(dateInput, { target: { value: '2025-12-15' } });
      
      // Set end time before start time
      const timeInputs = document.querySelectorAll('input[type="time"]');
      const startTimeInput = timeInputs[0];
      const endTimeInput = timeInputs[1];
      
      fireEvent.change(startTimeInput, { target: { value: '14:00' } });
      fireEvent.change(endTimeInput, { target: { value: '10:00' } });
      
      fireEvent.click(screen.getByRole('button', { name: /create event/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/end time must be after start time/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with correct data', async () => {
      global.fetch.mockImplementation((url) => {
        if (url.includes('/api/rooms/available')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        // Events endpoint
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 1, title: 'New Event' }),
        });
      });

      render(<CreateEventForm onEventCreated={mockOnEventCreated} />);
      
      const inputs = screen.getAllByRole('textbox');
      const titleInput = inputs.find(input => input.getAttribute('type') === 'text');
      await userEvent.type(titleInput, 'New Event');
      
      const dateInput = document.querySelector('input[type="date"]');
      fireEvent.change(dateInput, { target: { value: '2025-12-15' } });
      
      const timeInputs = document.querySelectorAll('input[type="time"]');
      fireEvent.change(timeInputs[0], { target: { value: '10:00' } });
      fireEvent.change(timeInputs[1], { target: { value: '12:00' } });
      
      fireEvent.click(screen.getByRole('button', { name: /create event/i }));
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/events', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }));
      });
    });

    it('should show success message on successful creation', async () => {
      global.fetch.mockImplementation((url) => {
        if (url.includes('/api/rooms/available')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 1, title: 'New Event' }),
        });
      });

      render(<CreateEventForm onEventCreated={mockOnEventCreated} />);
      
      const inputs = screen.getAllByRole('textbox');
      const titleInput = inputs.find(input => input.getAttribute('type') === 'text');
      await userEvent.type(titleInput, 'New Event');
      
      const dateInput = document.querySelector('input[type="date"]');
      fireEvent.change(dateInput, { target: { value: '2025-12-15' } });
      
      const timeInputs = document.querySelectorAll('input[type="time"]');
      fireEvent.change(timeInputs[0], { target: { value: '10:00' } });
      fireEvent.change(timeInputs[1], { target: { value: '12:00' } });
      
      fireEvent.click(screen.getByRole('button', { name: /create event/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/event created successfully/i)).toBeInTheDocument();
      });
    });

    it('should call onEventCreated callback on success', async () => {
      const mockEvent = { id: 1, title: 'New Event' };
      global.fetch.mockImplementation((url) => {
        if (url.includes('/api/rooms/available')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEvent),
        });
      });

      render(<CreateEventForm onEventCreated={mockOnEventCreated} />);
      
      const inputs = screen.getAllByRole('textbox');
      const titleInput = inputs.find(input => input.getAttribute('type') === 'text');
      await userEvent.type(titleInput, 'New Event');
      
      const dateInput = document.querySelector('input[type="date"]');
      fireEvent.change(dateInput, { target: { value: '2025-12-15' } });
      
      const timeInputs = document.querySelectorAll('input[type="time"]');
      fireEvent.change(timeInputs[0], { target: { value: '10:00' } });
      fireEvent.change(timeInputs[1], { target: { value: '12:00' } });
      
      fireEvent.click(screen.getByRole('button', { name: /create event/i }));
      
      await waitFor(() => {
        expect(mockOnEventCreated).toHaveBeenCalledWith(mockEvent);
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state during submission', async () => {
      // Use a controlled promise to test loading state
      let resolvePromise;
      global.fetch.mockImplementation((url) => {
        if (url.includes('/api/rooms/available')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        // Controlled promise for events endpoint
        return new Promise(resolve => {
          resolvePromise = () => resolve({
            ok: true,
            json: () => Promise.resolve({ id: 1 }),
          });
        });
      });

      const { unmount } = render(<CreateEventForm onEventCreated={mockOnEventCreated} />);
      
      const inputs = screen.getAllByRole('textbox');
      const titleInput = inputs.find(input => input.getAttribute('type') === 'text');
      await userEvent.type(titleInput, 'New Event');
      
      const dateInput = document.querySelector('input[type="date"]');
      fireEvent.change(dateInput, { target: { value: '2025-12-15' } });
      
      const timeInputs = document.querySelectorAll('input[type="time"]');
      fireEvent.change(timeInputs[0], { target: { value: '10:00' } });
      fireEvent.change(timeInputs[1], { target: { value: '12:00' } });
      
      fireEvent.click(screen.getByRole('button', { name: /create event/i }));
      
      // Wait for loading state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
      });
      
      // Cleanup - unmount before resolving to avoid act() warnings
      unmount();
    });
  });

  describe('Error Handling', () => {
    it('should show error message on API failure', async () => {
      global.fetch.mockImplementation((url) => {
        if (url.includes('/api/rooms/available')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to create event' }),
        });
      });

      render(<CreateEventForm onEventCreated={mockOnEventCreated} />);
      
      const inputs = screen.getAllByRole('textbox');
      const titleInput = inputs.find(input => input.getAttribute('type') === 'text');
      await userEvent.type(titleInput, 'New Event');
      
      const dateInput = document.querySelector('input[type="date"]');
      fireEvent.change(dateInput, { target: { value: '2025-12-15' } });
      
      const timeInputs = document.querySelectorAll('input[type="time"]');
      fireEvent.change(timeInputs[0], { target: { value: '10:00' } });
      fireEvent.change(timeInputs[1], { target: { value: '12:00' } });
      
      fireEvent.click(screen.getByRole('button', { name: /create event/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/failed to create event/i)).toBeInTheDocument();
      });
    });
  });
});

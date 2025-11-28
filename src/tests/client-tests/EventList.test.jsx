/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EventList from '../../client/src/components/EventList.jsx';

describe('EventList Component', () => {
  const mockBuilding = { id: 1, name: 'Engineering Building' };
  const mockOnClose = vi.fn();

  const mockEvents = [
    {
      id: 1,
      title: 'Test Event 1',
      room_number: '101',
      start_time: '2025-12-01T10:00:00.000Z',
      end_time: '2025-12-01T11:00:00.000Z',
      description: 'First test event description',
    },
    {
      id: 2,
      title: 'Test Event 2',
      room_number: '102',
      start_time: '2025-12-02T14:00:00.000Z',
      end_time: '2025-12-02T16:00:00.000Z',
      description: 'Second test event description',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should display "No data available" when no events', () => {
      render(<EventList building={mockBuilding} events={[]} onClose={mockOnClose} />);
      
      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
    });

    it('should display "No data available" when events is undefined', () => {
      render(<EventList building={mockBuilding} events={undefined} onClose={mockOnClose} />);
      
      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
    });

    it('should display events section header', () => {
      render(<EventList building={mockBuilding} events={mockEvents} onClose={mockOnClose} />);
      
      expect(screen.getByText('Events')).toBeInTheDocument();
    });

    it('should display event titles', () => {
      render(<EventList building={mockBuilding} events={mockEvents} onClose={mockOnClose} />);
      
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      expect(screen.getByText('Test Event 2')).toBeInTheDocument();
    });

    it('should display room numbers', () => {
      render(<EventList building={mockBuilding} events={mockEvents} onClose={mockOnClose} />);
      
      expect(screen.getByText(/Room Number: 101/)).toBeInTheDocument();
      expect(screen.getByText(/Room Number: 102/)).toBeInTheDocument();
    });

    it('should display start times', () => {
      render(<EventList building={mockBuilding} events={mockEvents} onClose={mockOnClose} />);
      
      // Check for start time display - component uses "Start Time:"
      const startTimeElements = screen.getAllByText(/Start Time:/);
      expect(startTimeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Expandable Events', () => {
    it('should show short date format initially', () => {
      render(<EventList building={mockBuilding} events={mockEvents} onClose={mockOnClose} />);
      
      // Initially should show short date format (e.g., "Dec 1")
      const dateElements = screen.getAllByText(/Date:/);
      expect(dateElements.length).toBeGreaterThan(0);
    });

    it('should expand event on click to show more details', () => {
      render(<EventList building={mockBuilding} events={mockEvents} onClose={mockOnClose} />);
      
      // Find and click the first event
      const eventTitle = screen.getByText('Test Event 1');
      fireEvent.click(eventTitle);
      
      // Should now show description
      expect(screen.getByText(/Description: First test event description/)).toBeInTheDocument();
    });

    it('should show end time when expanded', () => {
      render(<EventList building={mockBuilding} events={mockEvents} onClose={mockOnClose} />);
      
      const eventTitle = screen.getByText('Test Event 1');
      fireEvent.click(eventTitle);
      
      expect(screen.getByText(/End Time:/)).toBeInTheDocument();
    });

    it('should collapse event when clicked again', () => {
      render(<EventList building={mockBuilding} events={mockEvents} onClose={mockOnClose} />);
      
      const eventTitle = screen.getByText('Test Event 1');
      
      // Expand
      fireEvent.click(eventTitle);
      expect(screen.getByText(/Description: First test event description/)).toBeInTheDocument();
      
      // Collapse
      fireEvent.click(eventTitle);
      expect(screen.queryByText(/Description: First test event description/)).not.toBeInTheDocument();
    });

    it('should only expand one event at a time', () => {
      render(<EventList building={mockBuilding} events={mockEvents} onClose={mockOnClose} />);
      
      // Expand first event
      fireEvent.click(screen.getByText('Test Event 1'));
      expect(screen.getByText(/Description: First test event description/)).toBeInTheDocument();
      
      // Click second event
      fireEvent.click(screen.getByText('Test Event 2'));
      
      // First should collapse, second should expand
      expect(screen.queryByText(/Description: First test event description/)).not.toBeInTheDocument();
      expect(screen.getByText(/Description: Second test event description/)).toBeInTheDocument();
    });
  });
});

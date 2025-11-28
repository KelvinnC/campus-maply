/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoomList from '../../client/src/components/RoomList.jsx';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (ui) => {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  );
};

describe('RoomList Component', () => {
  const mockBuilding = { id: 1, name: 'Engineering Building' };
  const mockOnClose = vi.fn();

  const mockRooms = [
    { id: 1, room_number: '101', room_type: 'Classroom' },
    { id: 2, room_number: '102', room_type: 'Lab' },
  ];

  const mockWashrooms = [
    { id: 1, room_number: '100A', gender: 'All-gender', accessibility: 'Wheelchair accessible' },
  ];

  const mockBusinesses = [
    { id: 1, name: 'Test Cafe', category: 'Restaurant', hours: '9:00 AM - 5:00 PM' },
  ];

  const mockEvents = [];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should display building name', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={mockRooms} 
          washrooms={mockWashrooms}
          businesses={mockBusinesses}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.getByText('Engineering Building')).toBeInTheDocument();
    });

    it('should display close button', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={mockRooms}
          washrooms={[]}
          businesses={[]}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('should display "No data available" when all arrays are empty', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={[]}
          washrooms={[]}
          businesses={[]}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
    });
  });

  describe('Rooms Section', () => {
    it('should display rooms section header', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={mockRooms}
          washrooms={[]}
          businesses={[]}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.getByText('Rooms')).toBeInTheDocument();
    });

    it('should display room numbers', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={mockRooms}
          washrooms={[]}
          businesses={[]}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.getByText('101')).toBeInTheDocument();
      expect(screen.getByText('102')).toBeInTheDocument();
    });

    it('should display room types', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={mockRooms}
          washrooms={[]}
          businesses={[]}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.getByText('Classroom')).toBeInTheDocument();
      expect(screen.getByText('Lab')).toBeInTheDocument();
    });

    it('should navigate to room details when room is clicked', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={mockRooms}
          washrooms={[]}
          businesses={[]}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      fireEvent.click(screen.getByText('101'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/room/1');
    });
  });

  describe('Washrooms Section', () => {
    it('should display washrooms section header', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={[]}
          washrooms={mockWashrooms}
          businesses={[]}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.getByText('Washrooms')).toBeInTheDocument();
    });

    it('should display washroom details', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={[]}
          washrooms={mockWashrooms}
          businesses={[]}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.getByText('100A')).toBeInTheDocument();
      expect(screen.getByText('All-gender')).toBeInTheDocument();
      expect(screen.getByText('Wheelchair accessible')).toBeInTheDocument();
    });
  });

  describe('Businesses Section', () => {
    it('should display businesses section header', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={[]}
          washrooms={[]}
          businesses={mockBusinesses}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.getByText('Businesses')).toBeInTheDocument();
    });

    it('should display business details', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={[]}
          washrooms={[]}
          businesses={mockBusinesses}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.getByText('Test Cafe')).toBeInTheDocument();
      expect(screen.getByText('Restaurant')).toBeInTheDocument();
      expect(screen.getByText('9:00 AM - 5:00 PM')).toBeInTheDocument();
    });
  });

  describe('View Toggle', () => {
    it('should show "View Events" button', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={mockRooms}
          washrooms={[]}
          businesses={[]}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.getByText('View Events')).toBeInTheDocument();
    });

    it('should toggle to events view and show "View Rooms" button', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={mockRooms}
          washrooms={[]}
          businesses={[]}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      fireEvent.click(screen.getByText('View Events'));
      
      expect(screen.getByText('View Rooms')).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', () => {
      renderWithRouter(
        <RoomList 
          building={mockBuilding} 
          rooms={mockRooms}
          washrooms={[]}
          businesses={[]}
          events={mockEvents}
          onClose={mockOnClose} 
        />
      );
      
      fireEvent.click(screen.getByText('×'));
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});


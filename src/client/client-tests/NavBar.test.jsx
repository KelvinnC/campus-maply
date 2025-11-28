/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../src/components/NavBar.jsx';

// Mock useNavigate
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Helper to render with router
const renderWithRouter = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
};

describe('NavBar Component', () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null);
  });

  describe('Rendering', () => {
    it('should render the site title', () => {
      renderWithRouter(<NavBar />);
      
      expect(screen.getByText('Campus Maply')).toBeInTheDocument();
    });

    it('should render Login button when user is not logged in', () => {
      renderWithRouter(<NavBar />);
      
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should not show Login button on login page', () => {
      renderWithRouter(<NavBar />, { route: '/login' });
      
      expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
    });
  });

  describe('Logged in user', () => {
    it('should show Sign Out button when user is logged in', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        id: 1,
        email: 'user@test.com',
        status: 'VISITOR',
      }));

      renderWithRouter(<NavBar />);
      
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
    });

    it('should show Event Planner button for ADMIN users', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        id: 1,
        email: 'admin@test.com',
        status: 'ADMIN',
      }));

      renderWithRouter(<NavBar />);
      
      expect(screen.getByRole('button', { name: /event planer/i })).toBeInTheDocument();
    });

    it('should show Event Planner button for FACULTY users', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        id: 1,
        email: 'faculty@test.com',
        status: 'FACULTY',
      }));

      renderWithRouter(<NavBar />);
      
      expect(screen.getByRole('button', { name: /event planer/i })).toBeInTheDocument();
    });

    it('should show Event Planner button for EVENT_COORDINATOR users', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        id: 1,
        email: 'coordinator@test.com',
        status: 'EVENT_COORDINATOR',
      }));

      renderWithRouter(<NavBar />);
      
      expect(screen.getByRole('button', { name: /event planer/i })).toBeInTheDocument();
    });

    it('should NOT show Event Planner button for VISITOR users', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        id: 1,
        email: 'visitor@test.com',
        status: 'VISITOR',
      }));

      renderWithRouter(<NavBar />);
      
      expect(screen.queryByRole('button', { name: /event planer/i })).not.toBeInTheDocument();
    });

    it('should not show Event Planner button on event-planner page', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        id: 1,
        email: 'admin@test.com',
        status: 'ADMIN',
      }));

      renderWithRouter(<NavBar />, { route: '/event-planner' });
      
      expect(screen.queryByRole('button', { name: /event planer/i })).not.toBeInTheDocument();
    });
  });

  describe('Sign Out functionality', () => {
    it('should clear localStorage and navigate when Sign Out is clicked', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        id: 1,
        email: 'user@test.com',
        status: 'VISITOR',
      }));

      renderWithRouter(<NavBar />);
      
      const signOutButton = screen.getByRole('button', { name: /sign out/i });
      fireEvent.click(signOutButton);
      
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });

  describe('Navigation links', () => {
    it('should have a link to home page', () => {
      renderWithRouter(<NavBar />);
      
      const homeLink = screen.getByRole('link', { name: /campus maply/i });
      expect(homeLink).toHaveAttribute('href', '/');
    });
  });
});


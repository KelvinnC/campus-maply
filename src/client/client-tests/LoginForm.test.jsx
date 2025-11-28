/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../src/components/loginForm.jsx';

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

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockReset();
    localStorage.setItem.mockClear();
  });

  describe('Rendering', () => {
    it('should render login form by default', () => {
      renderWithRouter(<LoginForm />);
      
      expect(screen.getByText('Log in')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    });

    it('should not show name field in login mode', () => {
      renderWithRouter(<LoginForm />);
      
      expect(screen.queryByPlaceholderText('Full Name')).not.toBeInTheDocument();
    });

    it('should show toggle button to switch to register', () => {
      renderWithRouter(<LoginForm />);
      
      expect(screen.getByText(/don't have an account\? register/i)).toBeInTheDocument();
    });
  });

  describe('Mode Toggle', () => {
    it('should switch to register mode when toggle is clicked', async () => {
      renderWithRouter(<LoginForm />);
      
      const toggleButton = screen.getByText(/don't have an account\? register/i);
      fireEvent.click(toggleButton);
      
      // Check for the label (not the button) - use the role to distinguish
      expect(screen.getByRole('button', { name: /^register$/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    });

    it('should switch back to login mode', async () => {
      renderWithRouter(<LoginForm />);
      
      // Go to register
      fireEvent.click(screen.getByText(/don't have an account\? register/i));
      expect(screen.getByRole('button', { name: /^register$/i })).toBeInTheDocument();
      
      // Go back to login
      fireEvent.click(screen.getByText(/already have an account\? log in/i));
      expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    });
  });

  describe('Login Submission', () => {
    it('should submit login form with email and password', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          user: { id: 1, email: 'test@test.com', status: 'VISITOR' },
        }),
      });

      renderWithRouter(<LoginForm />);
      
      await userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
      
      fireEvent.click(screen.getByRole('button', { name: /^login$/i }));
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:4000/api/auth/login',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });
    });

    it('should save user to localStorage on successful login', async () => {
      const mockUser = { id: 1, email: 'test@test.com', status: 'VISITOR' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });

      renderWithRouter(<LoginForm />);
      
      await userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
      
      fireEvent.click(screen.getByRole('button', { name: /^login$/i }));
      
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
      });
    });

    it('should show success message on successful login', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          user: { id: 1, email: 'test@test.com', status: 'VISITOR' },
        }),
      });

      renderWithRouter(<LoginForm />);
      
      await userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
      
      fireEvent.click(screen.getByRole('button', { name: /^login$/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Successful login')).toBeInTheDocument();
      });
    });

    it('should show error message on failed login', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: false,
          message: 'Invalid email or password',
        }),
      });

      renderWithRouter(<LoginForm />);
      
      await userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'wrongpassword');
      
      fireEvent.click(screen.getByRole('button', { name: /^login$/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });
    });
  });

  describe('Registration Submission', () => {
    it('should submit registration form with name, email, and password', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          user: { id: 1, email: 'new@test.com', status: 'VISITOR', name: 'New User' },
        }),
      });

      renderWithRouter(<LoginForm />);
      
      // Switch to register mode
      fireEvent.click(screen.getByText(/don't have an account\? register/i));
      
      await userEvent.type(screen.getByPlaceholderText('Full Name'), 'New User');
      await userEvent.type(screen.getByPlaceholderText('Email'), 'new@test.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
      
      fireEvent.click(screen.getByRole('button', { name: /^register$/i }));
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:4000/api/auth/register',
          expect.objectContaining({
            method: 'POST',
          })
        );
      });
    });

    it('should show success message on successful registration', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          user: { id: 1, email: 'new@test.com', status: 'VISITOR' },
        }),
      });

      renderWithRouter(<LoginForm />);
      
      fireEvent.click(screen.getByText(/don't have an account\? register/i));
      
      await userEvent.type(screen.getByPlaceholderText('Full Name'), 'New User');
      await userEvent.type(screen.getByPlaceholderText('Email'), 'new@test.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
      
      fireEvent.click(screen.getByRole('button', { name: /^register$/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should show connection error on network failure', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<LoginForm />);
      
      await userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'password');
      
      fireEvent.click(screen.getByRole('button', { name: /^login$/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Connection error. Please try again.')).toBeInTheDocument();
      });
    });
  });
});

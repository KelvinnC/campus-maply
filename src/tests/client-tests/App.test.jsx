/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../client/src/App.jsx';

// Mock the page components to simplify testing
vi.mock('../../client/src/Page/MainMap.jsx', () => ({
  default: () => <div data-testid="main-map">MainMap Page</div>
}));

vi.mock('../../client/src/Page/Login.jsx', () => ({
  default: () => <div data-testid="login-page">Login Page</div>
}));

vi.mock('../../client/src/Page/EventManagerPage.jsx', () => ({
  default: () => <div data-testid="event-manager-page">Event Manager Page</div>
}));

vi.mock('../../client/src/Page/RoomDetails.jsx', () => ({
  default: () => <div data-testid="room-details-page">Room Details Page</div>
}));

describe('App Component', () => {
  describe('Routing', () => {
    it('should render MainMap on root path', () => {
      // App has its own BrowserRouter, so we render it directly
      // The mocked MainMap should be rendered
      render(<App />);
      
      expect(screen.getByTestId('main-map')).toBeInTheDocument();
    });
  });
});


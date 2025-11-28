/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EventBox from '../../client/src/components/EventBox.jsx';

describe('EventBox Component', () => {
  const mockEvent = {
    title: 'Test Event',
    date: '2025-12-01',
    time: '10:00 AM',
    location: 'EME 101',
  };

  it('should render event title', () => {
    render(<EventBox event={mockEvent} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('should render event date and time', () => {
    render(<EventBox event={mockEvent} />);
    
    expect(screen.getByText(/10:00 AM/)).toBeInTheDocument();
    expect(screen.getByText(/2025-12-01/)).toBeInTheDocument();
  });

  it('should render event location', () => {
    render(<EventBox event={mockEvent} />);
    
    expect(screen.getByText('EME 101')).toBeInTheDocument();
  });

  it('should render action button image', () => {
    render(<EventBox event={mockEvent} />);
    
    const actionImage = screen.getByAltText('actionButton');
    expect(actionImage).toBeInTheDocument();
  });

  it('should handle event with different data', () => {
    const differentEvent = {
      title: 'Another Event',
      date: '2025-12-25',
      time: '2:00 PM',
      location: 'SCI 200',
    };

    render(<EventBox event={differentEvent} />);
    
    expect(screen.getByText('Another Event')).toBeInTheDocument();
    expect(screen.getByText('SCI 200')).toBeInTheDocument();
  });
});


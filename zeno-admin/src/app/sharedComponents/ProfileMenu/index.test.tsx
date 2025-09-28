import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ProfileMenu from '.';
import '@testing-library/jest-dom';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('ProfileMenu', () => {
  it('renders the profile image with provided src', () => {
    render(<ProfileMenu image="/some-image.png" />);
    const img = screen.getByAltText('Profile');
    expect(img).toBeInTheDocument();
    expect(decodeURIComponent(img.getAttribute('src') ?? '')).toContain('/some-image.png');
  });

  it('renders default image if image prop is not provided', () => {
    render(<ProfileMenu />);
    const img = screen.getByAltText('Profile');
    expect(decodeURIComponent(img.getAttribute('src') ?? '')).toContain('/images/zeno-logo.png');
  });

  it('toggles menu on profile image click and closes on outside click', async () => {
    render(<ProfileMenu />);
    const img = screen.getByAltText('Profile');
    fireEvent.click(img);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
      expect(screen.queryByText('Log out')).not.toBeInTheDocument();
    });
  });

  it('navigates to /profile when Profile button is clicked', async () => {
    render(<ProfileMenu />);
    fireEvent.click(screen.getByAltText('Profile'));
    fireEvent.click(screen.getByText('Profile'));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });
  });

  it('shows logout confirmation popup when Log out is clicked', () => {
    render(<ProfileMenu />);
    fireEvent.click(screen.getByAltText('Profile'));
    fireEvent.click(screen.getByText('Log out'));
    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to log out?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getAllByText('Log out').length).toBeGreaterThanOrEqual(1);
  });

  it('clears localStorage and navigates to /login on logout confirmation', async () => {
    localStorage.setItem('token', '123');
    render(<ProfileMenu />);
    fireEvent.click(screen.getByAltText('Profile'));
    fireEvent.click(screen.getByText('Log out'));
    const buttons = screen.getAllByText('Log out');
    fireEvent.click(buttons[buttons.length - 1]);
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockPush).toHaveBeenCalledWith('/login');
      expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
    });
  });

  it('closes logout popup without logging out when Cancel is clicked', async () => {
    localStorage.setItem('token', '123');
    render(<ProfileMenu />);
    fireEvent.click(screen.getByAltText('Profile'));
    fireEvent.click(screen.getByText('Log out'));
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('123');
      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
    });
  });

  it('closes logout popup on outside click', async () => {
    render(<ProfileMenu />);
    fireEvent.click(screen.getByAltText('Profile'));
    fireEvent.click(screen.getByText('Log out'));
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
    });
  });
});
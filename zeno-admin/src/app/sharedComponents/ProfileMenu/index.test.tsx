import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ProfileMenu from '.';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('ProfileMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders the profile image with provided src', () => {
    render(<ProfileMenu image="/some-image.png" />);
    const img = screen.getByAltText('Profile');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/some-image.png');
  });

  it('renders default image if image prop is not provided', () => {
    render(<ProfileMenu />);
    const img = screen.getByAltText('Profile');
    expect(img).toHaveAttribute('src', '/images/zeno-logo.png');
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
    const push = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({ push });
    render(<ProfileMenu />);
    fireEvent.click(screen.getByAltText('Profile'));
    fireEvent.click(screen.getByText('Profile'));
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/profile');
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
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('clears localStorage and navigates to /login on logout confirmation', async () => {
    const push = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({ push });
    localStorage.setItem('token', '123');
    render(<ProfileMenu />);
    fireEvent.click(screen.getByAltText('Profile'));
    fireEvent.click(screen.getByText('Log out'));
    fireEvent.click(screen.getByText('Log out'));
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
      expect(push).toHaveBeenCalledWith('/login');
      expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
    });
  });

  it('closes logout popup without logging out when Cancel is clicked', async () => {
    const push = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({ push });
    localStorage.setItem('token', '123');
    render(<ProfileMenu />);
    fireEvent.click(screen.getByAltText('Profile'));
    fireEvent.click(screen.getByText('Log out'));
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('123');
      expect(push).not.toHaveBeenCalled();
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
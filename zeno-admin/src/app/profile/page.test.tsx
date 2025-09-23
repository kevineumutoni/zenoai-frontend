import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import useFetchAdmin from '../hooks/useFetchAdmin';
import ProfilePage from './page';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname: jest.fn(() => '/profile'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

jest.mock('../hooks/useFetchAdmin', () => jest.fn());

describe('ProfilePage', () => {
  const mockUser = {
    id: 1,
    first_name: 'Tirsit',
    last_name: 'Berihu',
    email: 'tirsit@gmail.com',
    image: 'https://example.com/photo.jpg',
    date_joined: '2025-01-01T00:00:00Z',
    registeredDate: '2025-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFetchAdmin as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
      error: null,
      updateAdmin: jest.fn((id, data) =>
        Promise.resolve({
          ...mockUser,
          ...data, 
          password: undefined,
        })
      ),
      refetch: jest.fn(),
    });
  });

  it('renders user details', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Tirsit')).toBeInTheDocument();
    expect(screen.getByText('Berihu')).toBeInTheDocument();
    expect(screen.getByText('tirsit@gmail.com')).toBeInTheDocument();
    expect(screen.getByAltText('Admin')).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('shows edit form when Update is clicked', () => {
    const { container } = render(<ProfilePage />);
    fireEvent.click(screen.getByText('Update'));

    expect(container.querySelector('input[name="first_name"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="last_name"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="password"]')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('shows error if password is missing on save', async () => {
    const { container } = render(<ProfilePage />);
    fireEvent.click(screen.getByText('Update'));

    fireEvent.change(container.querySelector('input[name="first_name"]')!, {
      target: { value: 'Tirsit Updated' },
    });
    fireEvent.change(container.querySelector('input[name="password"]')!, {
      target: { value: '' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Password is required to update the profile.')).toBeInTheDocument();
    });
  });

  it('shows success message on update and preserves unchanged fields', async () => {
    const { container } = render(<ProfilePage />);
    fireEvent.click(screen.getByText('Update'));


    fireEvent.change(container.querySelector('input[name="first_name"]')!, {
      target: { value: 'Tirsit Updated' },
    });
    fireEvent.change(container.querySelector('input[name="password"]')!, {
      target: { value: 'newpassword' },
    });

    expect(container.querySelector('input[name="last_name"]')).toHaveValue('Berihu');
    expect(container.querySelector('input[name="email"]')).toHaveValue('tirsit@gmail.com');

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
      expect(useFetchAdmin().updateAdmin).toHaveBeenCalledWith(1, {
        role: 'Admin',
        first_name: 'Tirsit Updated',
        last_name: 'Berihu',
        email: 'tirsit@gmail.com',
        image: 'https://example.com/photo.jpg',
        date_joined: '2025-01-01T00:00:00Z',
        password: 'newpassword',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Tirsit Updated')).toBeInTheDocument();
      expect(screen.getByText('Berihu')).toBeInTheDocument();
      expect(screen.getByText('tirsit@gmail.com')).toBeInTheDocument();
      expect(screen.getByAltText('Admin')).toHaveAttribute('src', 'https://example.com/photo.jpg');
    });
  });

  it('shows error block if error is present', () => {
    (useFetchAdmin as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: 'Failed to fetch!',
      updateAdmin: jest.fn(() => Promise.resolve()),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('Failed to fetch!')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    (useFetchAdmin as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
      error: null,
      updateAdmin: jest.fn(() => Promise.resolve()),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });
});
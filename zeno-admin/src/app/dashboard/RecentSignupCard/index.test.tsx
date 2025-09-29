import React from 'react';
import { render, screen } from '@testing-library/react';
import RecentSignupsCard from '.';

jest.mock('../../hooks/useFetchUsers', () => ({
  useUsers: jest.fn(),
}));

import { useUsers } from '../../hooks/useFetchUsers';

describe('RecentSignupsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useUsers as jest.Mock).mockReturnValue({
      users: null,
      loading: true,
      error: null,
    });

    render(<RecentSignupsCard />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useUsers as jest.Mock).mockReturnValue({
      users: null,
      loading: false,
      error: 'Failed to fetch users',
    });

    render(<RecentSignupsCard />);
    expect(screen.getByText(/Failed to fetch users/i)).toBeInTheDocument();
  });

  it('renders no users if the list is empty', () => {
    (useUsers as jest.Mock).mockReturnValue({
      users: [],
      loading: false,
      error: null,
    });

    render(<RecentSignupsCard />);
    expect(screen.getAllByText(/Recent Signups/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Most recent Signups/i)).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('renders only users with role "User", sorted by created_at descending', () => {
    const mockUsers = [
      {
        id: 1,
        role: "User",
        first_name: "Arsema",
        last_name: "Aregawi",
        email: "arsema@gmail.com",
        image: null,
        created_at: "2025-09-23T15:00:00Z",
      },
      {
        id: 2,
        role: "Admin",
        first_name: "Semhal",
        last_name: "Estifanos",
        email: "semhal@gmail.com",
        image: null,
        created_at: "2025-09-23T14:00:00Z",
      },
      {
        id: 3,
        role: "User",
        first_name: "Helen",
        last_name: "Yemane",
        email: "helen@gmail.com",
        image: null,
        created_at: "2025-09-23T16:00:00Z",
      },
      {
        id: 4,
        role: "User",
        first_name: "Pheobe",
        last_name: "Gloria",
        email: "pheobe@gmail.com",
        image: null,
        created_at: "2025-09-23T13:00:00Z",
      },
      {
        id: 5,
        role: "User",
        first_name: "Angela",
        last_name: "Wanjala",
        email: "angela@gmail.com",
        image: null,
        created_at: "2025-09-23T12:00:00Z",
      },
    ];
    (useUsers as jest.Mock).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
    });

    render(<RecentSignupsCard />);
    expect(screen.getByText(/Helen Yemane/i)).toBeInTheDocument();
    expect(screen.getByText(/Arsema Aregawi/i)).toBeInTheDocument();
    expect(screen.getByText(/Pheobe Gloria/i)).toBeInTheDocument();
    expect(screen.queryByText(/Semhal Estifanos/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Angela Wanjala/i)).not.toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Helen Yemane');
    expect(items[1]).toHaveTextContent('Arsema Aregawi');
    expect(items[2]).toHaveTextContent('Pheobe Gloria');
  });

  it('renders user image if available, or fallback icon if not', () => {
    const mockUsers = [
      {
        id: 1,
        role: "User",
        first_name: "Arsema",
        last_name: "Aregawi",
        email: "arsema@gmail.com",
        image: "http://photos.com/arsema.jpg",
        created_at: "2025-09-23T15:00:00Z",
      },
      {
        id: 2,
        role: "User",
        first_name: "Akeza",
        last_name: "Saloi",
        email: "akeza@gmail.com",
        image: null,
        created_at: "2025-09-23T14:00:00Z",
      },
    ];
    (useUsers as jest.Mock).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
    });

    render(<RecentSignupsCard />);
    const img = screen.getByAltText(/Arsema Aregawi/i);
    expect(img).toBeInTheDocument();
    expect(decodeURIComponent(img.getAttribute('src') ?? '')).toContain("http://photos.com/arsema.jpg");
    expect(screen.getByText(/Akeza Saloi/i)).toBeInTheDocument();
  });
});
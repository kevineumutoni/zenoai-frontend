import React from 'react';
import { render, screen } from '@testing-library/react';
import UserGrowthLineChart from '.';

jest.mock('../../hooks/useFetchUsers', () => ({
  useUsers: jest.fn(),
}));

import { useUsers } from '../../hooks/useFetchUsers';

describe('UserGrowthLineChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useUsers as jest.Mock).mockReturnValue({
      users: null,
      loading: true,
      error: null,
    });

    render(
      <div style={{ width: 800, height: 400 }}>
        <UserGrowthLineChart />
      </div>
    );
    expect(screen.getByText(/Loading user growth/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useUsers as jest.Mock).mockReturnValue({
      users: null,
      loading: false,
      error: 'Failed to fetch users',
    });

    render(
      <div style={{ width: 800, height: 400 }}>
        <UserGrowthLineChart />
      </div>
    );
    expect(screen.getByText(/Failed to fetch users/i)).toBeInTheDocument();
  });

  it('renders the line chart with the correct title and no users', () => {
    (useUsers as jest.Mock).mockReturnValue({
      users: [],
      loading: false,
      error: null,
    });

    render(
      <div style={{ width: 800, height: 400 }}>
        <UserGrowthLineChart />
      </div>
    );
    expect(screen.getByText(/User Growth \(This Week\)/i)).toBeInTheDocument();
    expect(screen.queryByText(/Loading user growth/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Failed to fetch users/i)).not.toBeInTheDocument();
  });

  it('renders with users data for the last 7 days, excluding non-User role and users older than 10 days', () => {
    const today = new Date();

    const user1 = {
      id: 1,
      created_at: new Date(today).toISOString(),
      first_name: 'Arsema',
      last_name: 'Aregawi',
      email: 'arsema@mail.com',
      role: 'User',
      image: null,
    };

    const user2 = {
      id: 2,
      created_at: (() => {
        const d = new Date(today);
        d.setDate(d.getDate() - 1);
        return d.toISOString();
      })(),
      first_name: 'Semhal',
      last_name: 'Estifanos',
      email: 'semhal@mail.com',
      role: 'User',
      image: null,
    };

    const user3 = {
      id: 3,
      created_at: (() => {
        const d = new Date(today);
        d.setDate(d.getDate() - 2);
        return d.toISOString();
      })(),
      first_name: 'Helen',
      last_name: 'Yemane',
      email: 'helen@mail.com',
      role: 'User',
      image: null,
    };

    const user4 = {
      id: 4,
      created_at: (() => {
        const d = new Date(today);
        d.setDate(d.getDate() - 3);
        return d.toISOString();
      })(),
      first_name: 'Arsu',
      last_name: 'Aregawi',
      email: 'arsema@mail.com',
      role: 'Admin',
      image: null,
    };

    const user5 = {
      id: 5,
      created_at: (() => {
        const d = new Date(today);
        d.setDate(d.getDate() - 11);
        return d.toISOString();
      })(),
      first_name: 'Judy',
      last_name: 'Gikuni',
      email: 'Judy@mail.com',
      role: 'User',
      image: null,
    };

    (useUsers as jest.Mock).mockReturnValue({
      users: [user1, user2, user3, user4, user5],
      loading: false,
      error: null,
    });

    render(
      <div style={{ width: 800, height: 400 }}>
        <UserGrowthLineChart />
      </div>
    );
    expect(screen.getByText(/User Growth \(This Week\)/i)).toBeInTheDocument();
    expect(screen.queryByText(/Arsu Aregawi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Judy Gikuni/i)).not.toBeInTheDocument();
  });
});
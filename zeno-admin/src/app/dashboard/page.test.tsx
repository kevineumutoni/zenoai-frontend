'use client';

import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import DashboardPage from './page';
import * as React from 'react';

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const resetMocks = () => {
  mockReplace.mockClear();
  localStorageMock.clear();
};

describe('DashboardPage', () => {
  beforeEach(() => {
    resetMocks();
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('redirects to /signin when no token exists', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/signin');
    });
  });

  it('redirects to /signin when role is not admin', async () => {
    localStorageMock.setItem('token', 'valid-token');
    localStorageMock.setItem('role', 'User');
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/signin');
    });
  });

  it('redirects to /signin when role is missing', async () => {
    localStorageMock.setItem('token', 'valid-token');
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/signin');
    });
  });

  it('renders dashboard when user is admin', async () => {
    localStorageMock.setItem('token', 'valid-token');
    localStorageMock.setItem('role', 'Admin');
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Module Usage')).toBeInTheDocument();
    expect(screen.getByText('User Feedback')).toBeInTheDocument();
    expect(screen.getByText('User Growth')).toBeInTheDocument();
    expect(screen.getByText('Weekly Usage')).toBeInTheDocument();
    expect(screen.getByText('Recent Signups')).toBeInTheDocument();
  });

  it('renders dashboard when role is "admin" (lowercase)', async () => {
    localStorageMock.setItem('token', 'valid-token');
    localStorageMock.setItem('role', 'admin');
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('shows nothing during initial check', () => {
    const { container } = render(<DashboardPage />);
    
    expect(container.firstChild).toBeNull();
  });
});
import { renderHook, waitFor, act } from '@testing-library/react';
import { useUsers } from './usefetchUsers';
import { fetchUsers } from '../utils/fetchUsers';
import type { User } from '../utils/types';

jest.mock('../utils/fetchUsers');

describe('useUsers hook', () => {
  const mockUsers: User[] = [
    {
      first_name: 'Alice',
      last_name: 'Smith',
      email: 'alice@example.com',
      role: 'user',
      created_at: '2023-01-10T10:00:00Z',
      image: undefined,
    },
    {
      first_name: 'Bob',
      last_name: 'Johnson',
      email: 'bob@example.com',
      role: 'admin',
      created_at: '2023-02-15T10:00:00Z',
      image: 'https://www.pinterest.com/pin/422281211926701/',
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('loads users successfully', async () => {
    (fetchUsers as jest.Mock).mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers());

    expect(result.current.loading).toBe(true);
    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error correctly', async () => {
    (fetchUsers as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useUsers());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Fetch failed');
    expect(result.current.users).toEqual([]);
  });

  it('reloads users when loadUsers is called', async () => {
    const firstUsers: User[] = [
      {
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice@example.com',
        role: 'user',
        created_at: '2023-01-10T10:00:00Z',
        image: undefined,
      },
    ];
    const secondUsers: User[] = [
      {
        first_name: 'Bob',
        last_name: 'Johnson',
        email: 'bob@example.com',
        role: 'admin',
        created_at: '2023-02-15T10:00:00Z',
        image: 'https://www.pinterest.com/pin/422281211926701/',
      },
    ];

    const fetchUsersMock = (fetchUsers as jest.Mock)
      .mockResolvedValueOnce(firstUsers)
      .mockResolvedValueOnce(secondUsers);

    const { result } = renderHook(() => useUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users).toEqual(firstUsers);

    await act(async () => {
      await result.current.loadUsers();
    });

    expect(fetchUsersMock).toHaveBeenCalledTimes(2);
    expect(result.current.users).toEqual(secondUsers);
    expect(result.current.error).toBeNull();
  });
});

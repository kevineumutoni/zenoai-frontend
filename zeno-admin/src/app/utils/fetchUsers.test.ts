import type { User } from './types';
import { fetchUsers } from './fetchUsers';


describe('fetchUsers', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('fetches users successfully with token in header', async () => {
    const mockUsers: User[] = [
       {
      first_name: "Jane",
      last_name: "Alex",
      email: "alice@example.com",
      role: "admin",
      created_at: "2023-01-10T10:00:00Z",
      image: undefined,
    },
    {
      first_name: "John",
      last_name: "Kamau",
      email: "john@example.com",
      role: "user",
      created_at: "2023-02-15T10:00:00Z",
      image: "https://www.pinterest.com/pin/422281211926701/",
    },
    ];
    localStorage.setItem('token', 'mock-token');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      } as Response)
    ) as jest.Mock;

    const users = await fetchUsers();

    expect(global.fetch).toHaveBeenCalledWith('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': 'mock-token',
      },
    });
    expect(users).toEqual(mockUsers);
  });

  it('throws an error if response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Unauthorized',
      } as Response)
    ) as jest.Mock;

    await expect(fetchUsers()).rejects.toThrow('Failed to fetch users: Unauthorized');
  });

  it('uses empty string token when no token in localStorage', async () => {
    const mockUsers: User[] = [];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      } as Response)
    ) as jest.Mock;

    await fetchUsers();

    expect(global.fetch).toHaveBeenCalledWith('/api/users', expect.objectContaining({
      headers: expect.objectContaining({
        'x-auth-token': '',
      }),
    }));
  });



});

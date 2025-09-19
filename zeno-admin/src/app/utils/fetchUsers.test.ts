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
      first_name: "Alice",
      last_name: "Smith",
      email: "alice@example.com",
      role: "admin",
      created_at: "2023-01-10T10:00:00Z",
      image: undefined,
    },
    {
      first_name: "Bob",
      last_name: "Johnson",
      email: "bob@example.com",
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

  it('returns an empty array when no users are found', async () => {
  const mockUsers: User[] = [];
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockUsers),
    } as Response)
  ) as jest.Mock;

  const users = await fetchUsers();

  expect(users).toEqual([]);
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

it('simulates loading state during fetchUsers', async () => {
  let resolveFetch: (value: Response) => void;
  global.fetch = jest.fn(() => new Promise<Response>(resolve => {
    resolveFetch = resolve;
  })) as jest.Mock;

  const promise = fetchUsers();

  expect(global.fetch).toHaveBeenCalled();

  resolveFetch!({
    ok: true,
    json: () => Promise.resolve([]),
  } as Response);

  const users = await promise;
  expect(users).toEqual([]);
});

});

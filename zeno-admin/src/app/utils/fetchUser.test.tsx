import { fetchUsers } from "./fetchUser";
global.fetch = jest.fn();

describe('fetchUsers', () => {
  const mockToken = '1234';
  const userIds = [1, 2];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('throws error if no token in localStorage', async () => {
    await expect(fetchUsers(userIds)).rejects.toThrow('Please log in.');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches users successfully', async () => {
    localStorage.setItem('token', mockToken);
    const mockResponse = [{ id: 1, name: 'arsema' }, { id: 2, name: 'aregawi' }];
    
  (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchUsers(userIds);
    expect(fetch).toHaveBeenCalledWith('/api/users?ids=1,2', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${mockToken}`,
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('throws error if response is not ok', async () => {
    localStorage.setItem('token', mockToken);
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => [],
    });

    await expect(fetchUsers(userIds)).rejects.toThrow('Failed to fetch users');
    expect(fetch).toHaveBeenCalled();
  });

  it('throws error if fetch throws', async () => {
    localStorage.setItem('token', mockToken);
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    await expect(fetchUsers(userIds)).rejects.toThrow('Failed to fetch users: Network error');
    expect(fetch).toHaveBeenCalled();
  });
});


import { fetchLogin } from './fetchlogin';

global.fetch = jest.fn();

describe('fetchLogin', () => {
  afterEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it('returns result when login succeeds', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ user: 'test' }),
    });

    const result = await fetchLogin('test@email.com', '1234');

    expect(fetch).toHaveBeenCalledWith('/api/auth', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@email.com', password: '1234' }),
    }));
    expect(result).toEqual({ user: 'test' });
  });

  it('throws error when response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => 'Unauthorized', 
    });

    await expect(fetchLogin('wrong@email.com', 'bad')).rejects.toThrow('Something went wrong: Unauthorized');
  });

  it('throws error if fetch throws', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network down'));

    await expect(fetchLogin('any@email.com', 'pass')).rejects.toThrow('Failed to login; Network down');
  });
});
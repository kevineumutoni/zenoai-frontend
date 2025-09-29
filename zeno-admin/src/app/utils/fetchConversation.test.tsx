import { createConversation } from '../utils/fetchConversation';

global.fetch = jest.fn();

beforeAll(() => {
  Object.defineProperty(global, 'localStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0,
    },
    writable: true,
  });
});


describe('createConversation', () => {
  const userId = 99;
  const token = 'jwt-token';

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    (global.localStorage.getItem as jest.Mock).mockReturnValue(token);
  });

  it('returns data on successful creation', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, userId }),
    });

    const result = await createConversation(userId);
    expect(fetch).toHaveBeenCalledWith('/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    expect(result).toEqual({ id: 1, userId });
  });

  it('throws error if response not ok', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Failed to create conversation' }),
    });

    await expect(createConversation(userId)).rejects.toThrow('Failed to create conversation');
  });

  it('throws error if fetch throws', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(createConversation(userId)).rejects.toThrow('Network error');
  });
});
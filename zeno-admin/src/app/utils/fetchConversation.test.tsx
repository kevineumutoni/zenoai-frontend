import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { createConversation } from './fetchConversation';

global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('createConversation', () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls fetch with correct parameters and returns data when response is ok', async () => {
    const mockResponseData = { conversationId: 1 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    } as unknown as Response);

    const userId = 123;
    const token = 'abc123';

    const result = await createConversation(userId, token);

    expect(mockFetch).toHaveBeenCalledWith('/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    expect(result).toEqual(mockResponseData);
  });

  it('throws an error when response is not ok', async () => {
    const errorMessage = 'Failed to create conversation';
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage }),
    } as unknown as Response);

    await expect(createConversation(123, 'token')).rejects.toThrow(errorMessage);
  });

  it('handles JSON parse failure gracefully by returning empty object', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('json parse error');
      },
    } as unknown as Response);

    const result = await createConversation(123, 'token');
    expect(result).toEqual({});
  });
});

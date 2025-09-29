import { createRun, fetchRunById } from '../utils/fetchPostRuns';

global.fetch = jest.fn();

describe('createRun', () => {
  const token = 'test-token';
  const conversationId = '123';
  const userInput = 'hello world';

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('throws error if no token is provided', async () => {
    await expect(createRun(conversationId, userInput)).rejects.toThrow('Please log in.');
  });

  it('makes a POST request with JSON when no files are provided', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ runId: 1 }),
    });

    const result = await createRun(conversationId, userInput, token);
    expect(fetch).toHaveBeenCalledWith('/api/runs', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation_id: conversationId, user_input: userInput }),
    });
    expect(result).toEqual({ runId: 1 });
  });

  it('makes a POST request with FormData when files are provided', async () => {
    const file = new File(['foo'], 'foo.txt');
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ runId: 2 }),
    });

    await createRun(conversationId, userInput, token, [file]);
    const callArgs = (fetch as jest.Mock).mock.calls[0][1];
    expect(callArgs.method).toBe('POST');
    expect(callArgs.headers['Authorization']).toBe(`Token ${token}`);
    expect(callArgs.headers['Content-Type']).toBeUndefined();
    expect(callArgs.body instanceof FormData).toBe(true);
  });

  it('throws error with response message if not ok', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Run failed' }),
    });

    await expect(createRun(conversationId, userInput, token)).rejects.toThrow('Run failed');
  });

  it('parses non-JSON response gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: { get: () => 'text/plain' },
      text: async () => 'plain text',
      json: async () => { throw new Error('fail'); },
    });

    const result = await createRun(conversationId, userInput, token);
    expect(result).toEqual({ message: 'plain text' });
  });
});

describe('fetchRunById', () => {
  const token = 'test-token';
  const runId = 42;

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('throws error if no token is provided', async () => {
    await expect(fetchRunById(runId)).rejects.toThrow('Please log in.');
  });

  it('makes a GET request and returns JSON response', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ id: runId }),
    });

    const result = await fetchRunById(runId, token);
    expect(fetch).toHaveBeenCalledWith(`/api/run?id=${runId}`, {
      headers: { 'Authorization': `Token ${token}` },
    });
    expect(result).toEqual({ id: runId });
  });

  it('throws error with response message if not ok', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Not found' }),
    });

    await expect(fetchRunById(runId, token)).rejects.toThrow('Not found');
  });

  it('parses non-JSON response gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: { get: () => 'text/plain' },
      text: async () => 'not json',
      json: async () => { throw new Error('fail'); },
    });

    const result = await fetchRunById(runId, token);
    expect(result).toEqual({ message: 'not json' });
  });
});
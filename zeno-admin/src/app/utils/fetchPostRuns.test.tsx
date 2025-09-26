import { createRun, fetchRunById } from './fetchPostRuns';

global.fetch = jest.fn();

describe('postRuns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a text-only run successfully', async () => {
    const mockResponse = { id: 1, user_input: 'hello', status: 'pending' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve(mockResponse),
    });

    const result = await createRun('c001', 'hello');

    expect(fetch).toHaveBeenCalledWith(
      '/api/conversationruns',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: 'c001', userInput: 'hello' }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('should create a run with file upload successfully', async () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const mockResponse = { id: 2, user_input: '(file upload)', status: 'pending' };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve(mockResponse),
    });

    const result = await createRun(null, 'file msg', undefined, [mockFile]);

    const callArgs = (fetch as jest.Mock).mock.calls[0];
    const formData = callArgs[1].body as FormData;

    expect(formData.get('userInput')).toBe('file msg');
    expect(formData.getAll('files')).toHaveLength(1);
    expect(result).toEqual(mockResponse);
  });

  it('should include authorization header when token is provided', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ id: 1 }),
    });

    await createRun('c001', 'hello', 'token');

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Token token',
        }),
      })
    );
  });

  it('should fetch run by ID successfully', async () => {
    const mockResponse = { id: 1, status: 'completed', final_output: 'Hello my name is Zeno' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchRunById(123);

    expect(fetch).toHaveBeenCalledWith('/api/run?id=123', {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should include token in fetchRunById request', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ id: 1 }),
    });

    await fetchRunById(456, 'fetch-token');

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Token fetch-token',
        }),
      })
    );
  });

  it('should handle empty backend response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'text/plain' },
      text: () => Promise.resolve(''),
    });

    const result = await fetchRunById(789);

    expect(result).toEqual({});
  });

  it('should handle backend text response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'text/plain' },
      text: () => Promise.resolve('Some text response'),
    });

    const result = await fetchRunById(101112);

    expect(result).toEqual({ message: 'Some text response' });
  });

});

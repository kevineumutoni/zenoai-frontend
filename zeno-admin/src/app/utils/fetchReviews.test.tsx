import { fetchReviews } from "./fetchReviews";

describe('fetchReviews', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'token') return 'fake-token';
      return null;
    });

    global.fetch = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('throws error if no token', async () => {
    (Storage.prototype.getItem as jest.Mock).mockReturnValueOnce(null);
    await expect(fetchReviews()).rejects.toThrow('Please log in.');
  });
  
  it('throws error if response not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({}),
    });
    await expect(fetchReviews()).rejects.toThrow(
      'Unable to fetch users feedback, Try again.'
    );
  });
  it('returns JSON result if fetch successful', async () => {
    const mockData = [{ id: 1, review_text: 'Great' }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await fetchReviews();

    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/user_feedback', {
      method: 'GET',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        Authorization: 'Token fake-token',
      }),
    });
  });

  it('throws error if fetch throws', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchReviews()).rejects.toThrow(
      "We couldn't load users feedback: Network error"
    );
  });
});

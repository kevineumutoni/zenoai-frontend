import { fetchAnalytics } from './fetchSteps';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

global.fetch = jest.fn();

describe('fetchAnalytics utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws if no token in localStorage', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    await expect(fetchAnalytics()).rejects.toThrow('Please log in to access usage analytics data.');
  });

  it('successfully fetches and returns steps data', async () => {
    const mockToken = 'fake-token';
    const mockResponse = { steps: [] };

    localStorageMock.getItem.mockReturnValue(mockToken);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchAnalytics();

    expect(global.fetch).toHaveBeenCalledWith('/api/steps', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${mockToken}`,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('throws if response is not ok', async () => {
    localStorageMock.getItem.mockReturnValue('fake-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Bad Request'),
    });

    await expect(fetchAnalytics()).rejects.toThrow('Unable to fetch analytics data. Please try again later.');
  });

  it('throws with descriptive message on network error', async () => {
    localStorageMock.getItem.mockReturnValue('fake-token');
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network failure'));

    await expect(fetchAnalytics()).rejects.toThrow("We couldn't load the analytics data: Network failure");
  });
});
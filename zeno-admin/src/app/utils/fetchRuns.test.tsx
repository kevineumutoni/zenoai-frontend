import { fetchRuns } from "./fetchRuns";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });


global.fetch = jest.fn();

describe('fetchRuns', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it('throws error if no token in localStorage', async () => {
    await expect(fetchRuns()).rejects.toThrow('Please log in to access system health data.');
  });

  it('throws error if fetch response is not ok', async () => {
    localStorage.setItem('token', 'dummy-token');
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn(),
    });

    await expect(fetchRuns()).rejects.toThrow('Unable to fetch system data. Please try again later.');
  });

  it('returns data if fetch succeeds', async () => {
    localStorage.setItem('token', 'dummy-token');
    const mockData = [{ id: 1, status: 'completed' }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const data = await fetchRuns();
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/runs', expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        Authorization: 'Token dummy-token',
      }),
    }));
  });

  it('throws error with fetch failure message', async () => {
    localStorage.setItem('token', 'dummy-token');
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchRuns()).rejects.toThrow("We couldn't load the system data: Network error");
  });
});

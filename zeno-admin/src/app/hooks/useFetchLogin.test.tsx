import { renderHook, act, waitFor } from '@testing-library/react';
import { useFetchLogin } from './useFetchLogin';
import { fetchLogin } from '../utils/fetchLogin';

jest.mock('../utils/fetchLogin', () => ({
  fetchLogin: jest.fn(),
}));

const mockedFetchLogin = fetchLogin as jest.MockedFunction<typeof fetchLogin>;
describe('useFetchLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });
  it('returns result and sets loading/error correctly on success', async () => {
    mockedFetchLogin.mockResolvedValue({ token: 'mytoken', user: 'ok' });
    const { result } = renderHook(() => useFetchLogin());
    await act(async () => {
      await result.current.login('ok@email.com', 'good');
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBeNull();
    expect(localStorage.getItem('token')).toBe('mytoken');
  });
  it('sets error on failed login', async () => {
    mockedFetchLogin.mockRejectedValue(new Error('Invalid credentials'));
    const { result } = renderHook(() => useFetchLogin());
    await act(async () => {
      await result.current.login('kevine@email.com', 'Umutoni123');
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.message).toBe('Invalid credentials');
      expect(localStorage.getItem('token')).toBe(null);
    });
  });
});

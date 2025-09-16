import { renderHook, act, waitFor } from '@testing-library/react';
import { useFetchLogin } from './usefetchlogin';

jest.mock('../utils/fetchlogin', () => ({
  fetchLogin: jest.fn(),
}));
const { fetchLogin } = require('../utils/fetchlogin');

describe('useFetchLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns result and sets loading/error correctly on success', async () => {
    fetchLogin.mockResolvedValue({ user: 'ok' });

    const { result } = renderHook(() => useFetchLogin());
    await act(async () => {
      await result.current.login('ok@email.com', 'good');
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBeNull();
  });

  it('sets error on failed login', async () => {
    fetchLogin.mockRejectedValue(new Error('Invalid credentials'));
    const { result } = renderHook(() => useFetchLogin());

    await act(async () => {
      await result.current.login('kevine@email.com', 'Umutoni123');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.message).toBe('Invalid credentials');
    });
  });
});
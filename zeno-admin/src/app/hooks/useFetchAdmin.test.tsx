import { renderHook, act } from '@testing-library/react';
import usefetchAdmins from './useFetchAdmin';

jest.mock('../utils/fetchAdmin', () => ({
  fetchCurrentAdmin: jest.fn(),
  updateCurrentAdmin: jest.fn(),
}));

const { fetchCurrentAdmin, updateCurrentAdmin } = require('../utils/fetchAdmin');

describe('usefetchAdmins hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches user and sets loading/error on success', async () => {
    fetchCurrentAdmin.mockResolvedValue({
      id: 1,
      user_id: 1,
      first_name: 'Tirsit',
      last_name: 'Berihu',
      email: 'tirsit@example.com',
    });

    const { result } = renderHook(() => usefetchAdmins());

    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toMatchObject({
      id: 1,
      user_id: 1,
      first_name: 'Tirsit',
      last_name: 'Berihu',
      email: 'tirsit@example.com',
    });
    expect(result.current.error).toBeNull();
  });

  it('sets error if fetchCurrentAdmin fails', async () => {
    fetchCurrentAdmin.mockRejectedValue(new Error('Not authorized'));

    const { result } = renderHook(() => usefetchAdmins());
    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe('Not authorized');
  });

  it('updates user with updateAdmin', async () => {
    fetchCurrentAdmin.mockResolvedValue({
      id: 2,
      user_id: 2,
      first_name: 'Arsu',
      last_name: 'Aregawi',
      email: 'arsu@gmail.com',
    });
    updateCurrentAdmin.mockResolvedValue({
      id: 3,
      user_id: 3,
      first_name: 'Tirsit',
      last_name: 'Berihu',
      email: 'Tirsit@example.com',
    });

    const { result } = renderHook(() => usefetchAdmins());

    await act(async () => {});

    await act(async () => {
      await result.current.updateAdmin(3, {
        first_name: 'Tirsit',
        last_name: 'Berihu',
        email: 'Tirsit@example.com',
      });
    });

    expect(result.current.user).toMatchObject({
      id: 3,
      user_id: 3,
      first_name: 'Tirsit',
      last_name: 'Berihu',
      email: 'Tirsit@example.com',
    });
    expect(result.current.error).toBeNull();
  });

  it('sets error if fetchCurrentAdmin returns null or undefined', async () => {
    fetchCurrentAdmin.mockResolvedValue(null);

    const { result } = renderHook(() => usefetchAdmins());

    await act(async () => { });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toMatch(/Cannot read properties of null/)
  });

});
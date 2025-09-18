import { renderHook, act, waitFor } from '@testing-library/react';
import { useFetchRuns } from './useFetchRuns';
import * as fetchRunsModule from '../utils/fetchRuns';

const mockRuns = [
  {
    id: 1,
    conversation: 123,
    user_input: 'Input text',
    final_output: 'Output text',
    status: 'completed',
    started_at: '2025-09-10T10:00:00Z',
    completed_at: '2025-09-10T10:01:00Z',
    input_files: [],
    output_artifacts: [],
  },
];

describe('useFetchRuns hook', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches data successfully', async () => {
    jest.spyOn(fetchRunsModule, 'fetchRuns').mockResolvedValue(mockRuns);

    const { result } = renderHook(() => useFetchRuns());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockRuns);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    jest.spyOn(fetchRunsModule, 'fetchRuns').mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useFetchRuns());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error?.message).toBe('Fetch failed');
  });

  it('manually triggers fetchData without warnings', async () => {
    jest.spyOn(fetchRunsModule, 'fetchRuns').mockResolvedValue(mockRuns);

    const { result } = renderHook(() => useFetchRuns());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.data).toEqual(mockRuns);
    expect(result.current.error).toBeNull();
  });
});

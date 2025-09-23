import { renderHook, waitFor } from '@testing-library/react';
import { useFetchAnalytics } from './useFetchSteps';
import * as fetchStepsModule from '../utils/fetchSteps';
import { Step } from '../utils/types/steps';

const mockSteps: Step[] = [
  {
    step_id: 2,
    conversation: 123,
    step_order: 1,
    type: 'sub_agent_call',
    tool: 'rag_tool',
    agent: 5,
    created_at: '2025-09-15T10:00:00Z',
    content: { function: 'TradeForecastAgent.run()' },
  },
];

describe('useFetchAnalytics hook', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches steps data successfully on mount', async () => {
    jest.spyOn(fetchStepsModule, 'fetchAnalytics').mockResolvedValue({ steps: mockSteps });

    const { result } = renderHook(() => useFetchAnalytics());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.steps).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.steps).toEqual(mockSteps);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error gracefully', async () => {
    const errorMessage = 'Network error';
    jest.spyOn(fetchStepsModule, 'fetchAnalytics').mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchAnalytics());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.steps).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });
});
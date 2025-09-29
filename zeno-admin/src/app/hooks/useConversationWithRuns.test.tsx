import { render, act } from '@testing-library/react';
import { useConversationsWithRuns } from './useConversationWithRuns';
import * as fetchConversationWithRuns from '../utils/fetchConversationWithRuns';
import React from 'react';

type Conversation = {
  conversation_id: number;
  title: string;
  runs: unknown[];
  created_at: string;
};

type HookReturn = ReturnType<typeof useConversationsWithRuns>;

const mockConvos: Conversation[] = [
  { conversation_id: 1, title: 'First', runs: [], created_at: '2023-01-01T00:00:00Z' },
  { conversation_id: 2, title: 'Second', runs: [], created_at: '2023-01-02T00:00:00Z' },
];

function HookWrapper({ token }: { token?: string }) {
  const hook = useConversationsWithRuns(token);
  (window as unknown as { hook: HookReturn }).hook = hook;
  return null;
}

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('not wrapped in act')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('useConversationsWithRuns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as unknown as { hook?: HookReturn }).hook;
  });

  it('does not fetch if no token', async () => {
    const spy = jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns');
    await act(async () => {
      render(<HookWrapper />);
    });
    expect(spy).not.toHaveBeenCalled();
    const hook = (window as unknown as { hook: HookReturn }).hook;
    expect(hook.conversations).toEqual([]);
    expect(hook.loading).toBe(false);
    expect(hook.error).toBeNull();
  });

  it('fetches conversations and sets state', async () => {
    jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns').mockResolvedValue(mockConvos);
    await act(async () => {
      render(<HookWrapper token="token" />);
    });
    await act(async () => {
      await (window as unknown as { hook: HookReturn }).hook.fetchConvos();
    });
    const hook = (window as unknown as { hook: HookReturn }).hook;
    expect(hook.conversations).toEqual(mockConvos);
    expect(hook.selectedConversationId).toBe(1);
    expect(hook.loading).toBe(false);
    expect(hook.error).toBeNull();
  });

  it('sets error if fetch fails', async () => {
    jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns').mockRejectedValue(new Error('fail'));
    await act(async () => {
      render(<HookWrapper token="token" />);
    });
    await act(async () => {
      await (window as unknown as { hook: HookReturn }).hook.fetchConvos();
    });
    const hook = (window as unknown as { hook: HookReturn }).hook;
    expect(hook.conversations).toEqual([]);
    expect(hook.error).toBe('fail');
    expect(hook.loading).toBe(false);
  });

  it('sets selectedConversationId to first when data returned and none selected', async () => {
    jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns').mockResolvedValue(mockConvos);
    await act(async () => {
      render(<HookWrapper token="token" />);
    });
    await act(async () => {
      await (window as unknown as { hook: HookReturn }).hook.fetchConvos();
    });
    const hook = (window as unknown as { hook: HookReturn }).hook;
    expect(hook.selectedConversationId).toBe(mockConvos[0].conversation_id);
  });

  it('allows manual selection of conversation', async () => {
    jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns').mockResolvedValue(mockConvos);
    await act(async () => {
      render(<HookWrapper token="token" />);
    });
    await act(async () => {
      await (window as unknown as { hook: HookReturn }).hook.fetchConvos();
    });
    act(() => {
      (window as unknown as { hook: HookReturn }).hook.setSelectedConversationId(2);
    });
    const hook = (window as unknown as { hook: HookReturn }).hook;
    expect(hook.selectedConversationId).toBe(2);
  });

  it('allows manual update of conversations', async () => {
    jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns').mockResolvedValue(mockConvos);
    await act(async () => {
      render(<HookWrapper token="token" />);
    });
    await act(async () => {
      await (window as unknown as { hook: HookReturn }).hook.fetchConvos();
    });
    act(() => {
      (window as unknown as { hook: HookReturn }).hook.setConversations([
        { conversation_id: 3, title: 'Third', runs: [], created_at: '2023-01-03T00:00:00Z' }
      ]);
    });
    const hook = (window as unknown as { hook: HookReturn }).hook;
    expect(hook.conversations).toEqual([
      { conversation_id: 3, title: 'Third', runs: [], created_at: '2023-01-03T00:00:00Z' }
    ]);
  });

  it('fetchConvos can be called manually', async () => {
    const spy = jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns').mockResolvedValue(mockConvos);
    await act(async () => {
      render(<HookWrapper token="token" />);
    });
    await act(async () => {
      await (window as unknown as { hook: HookReturn }).hook.fetchConvos();
      (window as unknown as { hook: HookReturn }).hook.setConversations([]);
      (window as unknown as { hook: HookReturn }).hook.setSelectedConversationId(null);
      await (window as unknown as { hook: HookReturn }).hook.fetchConvos();
    });
    const hook = (window as unknown as { hook: HookReturn }).hook;
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(hook.conversations).toEqual(mockConvos);
    expect(hook.selectedConversationId).toBe(1);
  });
});
import { render, act } from '@testing-library/react';
import { useConversationsWithRuns } from './useConversationWithRuns';
import * as fetchConversationWithRuns from '../utils/fetchConversationWithRuns';
import React from 'react';

const mockConvos = [
  { conversation_id: 1, title: 'First', runs: [], created_at: '2023-01-01T00:00:00Z' },
  { conversation_id: 2, title: 'Second', runs: [], created_at: '2023-01-02T00:00:00Z' },
];

function HookWrapper({ token }: { token?: string }) {
  const hook = useConversationsWithRuns(token);
  (window as any).hook = hook;
  return null;
}

describe('useConversationsWithRuns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as any).hook;
  });

  it('does not fetch if no token', async () => {
    const spy = jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns');
    render(<HookWrapper />);
    expect(spy).not.toHaveBeenCalled();
    expect((window as any).hook.conversations).toEqual([]);
    expect((window as any).hook.loading).toBe(false);
    expect((window as any).hook.error).toBeNull();
  });

  it('fetches conversations and sets state', async () => {
    jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns').mockResolvedValue(mockConvos);
    render(<HookWrapper token="token" />);
    await act(async () => {
      await (window as any).hook.fetchConvos();
    });
    expect((window as any).hook.conversations).toEqual(mockConvos);
    expect((window as any).hook.selectedConversationId).toBe(1);
    expect((window as any).hook.loading).toBe(false);
    expect((window as any).hook.error).toBeNull();
  });

  it('sets error if fetch fails', async () => {
    jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns').mockRejectedValue(new Error('fail'));
    render(<HookWrapper token="token" />);
    await act(async () => {
      await (window as any).hook.fetchConvos();
    });
    expect((window as any).hook.conversations).toEqual([]);
    expect((window as any).hook.error).toBe('fail');
    expect((window as any).hook.loading).toBe(false);
  });

  it('sets selectedConversationId to first when data returned and none selected', async () => {
    jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns').mockResolvedValue(mockConvos);
    render(<HookWrapper token="token" />);
    await act(async () => {
      await (window as any).hook.fetchConvos();
    });
    expect((window as any).hook.selectedConversationId).toBe(mockConvos[0].conversation_id);
  });

  it('allows manual selection of conversation', async () => {
    jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns').mockResolvedValue(mockConvos);
    render(<HookWrapper token="token" />);
    await act(async () => {
      await (window as any).hook.fetchConvos();
    });
    act(() => {
      (window as any).hook.setSelectedConversationId(2);
    });
    expect((window as any).hook.selectedConversationId).toBe(2);
  });

  it('allows manual update of conversations', async () => {
    jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns').mockResolvedValue(mockConvos);
    render(<HookWrapper token="token" />);
    await act(async () => {
      await (window as any).hook.fetchConvos();
    });
    act(() => {
      (window as any).hook.setConversations([
        { conversation_id: 3, title: 'Third', runs: [], created_at: '2023-01-03T00:00:00Z' }
      ]);
    });
    expect((window as any).hook.conversations).toEqual([
      { conversation_id: 3, title: 'Third', runs: [], created_at: '2023-01-03T00:00:00Z' }
    ]);
  });

  it('fetchConvos can be called manually', async () => {
    const spy = jest.spyOn(fetchConversationWithRuns, 'getConversationsWithRuns').mockResolvedValue(mockConvos);
    render(<HookWrapper token="token" />);
    await act(async () => {
      await (window as any).hook.fetchConvos();
      (window as any).hook.setConversations([]);
      (window as any).hook.setSelectedConversationId(null);
      await (window as any).hook.fetchConvos();
    });
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect((window as any).hook.conversations).toEqual(mockConvos);
    expect((window as any).hook.selectedConversationId).toBe(1);
  });
});
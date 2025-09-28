import { render, act } from '@testing-library/react';
import { useConversation } from './useFetchConversations';
import * as fetchConversation from '../utils/fetchConversation';
import React from 'react';

function HookWrapper({ userId, token }: { userId?: number, token?: string }) {
  const hook = useConversation(userId, token);
  (window as any).hook = hook; // expose for access in tests
  return null;
}

describe('useConversation', () => {
  const userId = 1;
  const token = 'token';
  const mockResponse = { conversation_id: 'abc123' };

  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as any).hook;
  });

  it('returns null if userId or token not provided', async () => {
    render(<HookWrapper />);
    let convo: any;
    await act(async () => {
      convo = await (window as any).hook.startConversation();
    });
    expect(convo).toBeNull();
    expect((window as any).hook.loading).toBe(false);
    expect((window as any).hook.conversationId).toBeNull();
  });

  it('returns existing conversationId if already set', async () => {
    render(<HookWrapper userId={userId} token={token} />);
    act(() => {
      (window as any).hook.setConversationId('existing-cid');
    });
    let convo: any;
    await act(async () => {
      convo = await (window as any).hook.startConversation();
    });
    expect(convo).toBe('existing-cid');
    expect((window as any).hook.loading).toBe(false);
  });

  it('calls createConversation and sets conversationId', async () => {
    jest.spyOn(fetchConversation, 'createConversation').mockResolvedValue(mockResponse);
    render(<HookWrapper userId={userId} token={token} />);
    let convoId: any;
    await act(async () => {
      convoId = await (window as any).hook.startConversation();
    });
    expect(fetchConversation.createConversation).toHaveBeenCalledWith(userId);
    expect(convoId).toBe(mockResponse.conversation_id);
    expect((window as any).hook.conversationId).toBe(mockResponse.conversation_id);
  });

  it('sets error if createConversation throws', async () => {
    jest.spyOn(fetchConversation, 'createConversation').mockRejectedValue(new Error('fail'));
    render(<HookWrapper userId={userId} token={token} />);
    let convoId: any;
    await act(async () => {
      convoId = await (window as any).hook.startConversation();
    });
    expect(convoId).toBeNull();
    expect((window as any).hook.error).toBe('fail');
    expect((window as any).hook.loading).toBe(false);
  });

  it('resetConversation sets conversationId to null', () => {
    render(<HookWrapper userId={userId} token={token} />);
    act(() => {
      (window as any).hook.setConversationId('abc123');
      (window as any).hook.resetConversation();
    });
    expect((window as any).hook.conversationId).toBeNull();
  });
});
import { render, act } from '@testing-library/react';
import { useConversation } from './useFetchConversations';
import * as fetchConversation from '../utils/fetchConversation';
import React from 'react';

type ConversationHookReturn = ReturnType<typeof useConversation>;
type CreateConversationResponse = { conversation_id: string };

function HookWrapper({ userId, token }: { userId?: number; token?: string }) {
  const hook = useConversation(userId, token);
  (window as unknown as { hook: ConversationHookReturn }).hook = hook;
  return null;
}

describe('useConversation', () => {
  const userId = 1;
  const token = 'token';
  const mockResponse: CreateConversationResponse = { conversation_id: 'abc123' };

  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as unknown as { hook?: ConversationHookReturn }).hook;
  });

  it('returns null if userId or token not provided', async () => {
    render(<HookWrapper />);
    let convo: string | null = null;
    await act(async () => {
      convo = await (window as unknown as { hook: ConversationHookReturn }).hook.startConversation();
    });
    const hook = (window as unknown as { hook: ConversationHookReturn }).hook;
    expect(convo).toBeNull();
    expect(hook.loading).toBe(false);
    expect(hook.conversationId).toBeNull();
  });

  it('returns existing conversationId if already set', async () => {
    render(<HookWrapper userId={userId} token={token} />);
    act(() => {
      (window as unknown as { hook: ConversationHookReturn }).hook.setConversationId('existing-cid');
    });
    let convo: string | null = null;
    await act(async () => {
      convo = await (window as unknown as { hook: ConversationHookReturn }).hook.startConversation();
    });
    const hook = (window as unknown as { hook: ConversationHookReturn }).hook;
    expect(convo).toBe('existing-cid');
    expect(hook.loading).toBe(false);
  });

  it('calls createConversation and sets conversationId', async () => {
    jest.spyOn(fetchConversation, 'createConversation').mockResolvedValue(mockResponse);
    render(<HookWrapper userId={userId} token={token} />);
    let convoId: string | null = null;
    await act(async () => {
      convoId = await (window as unknown as { hook: ConversationHookReturn }).hook.startConversation();
    });
    const hook = (window as unknown as { hook: ConversationHookReturn }).hook;
    expect(fetchConversation.createConversation).toHaveBeenCalledWith(userId);
    expect(convoId).toBe(mockResponse.conversation_id);
    expect(hook.conversationId).toBe(mockResponse.conversation_id);
  });

  it('sets error if createConversation throws', async () => {
    jest.spyOn(fetchConversation, 'createConversation').mockRejectedValue(new Error('fail'));
    render(<HookWrapper userId={userId} token={token} />);
    let convoId: string | null = null;
    await act(async () => {
      convoId = await (window as unknown as { hook: ConversationHookReturn }).hook.startConversation();
    });
    const hook = (window as unknown as { hook: ConversationHookReturn }).hook;
    expect(convoId).toBeNull();
    expect(hook.error).toBe('fail');
    expect(hook.loading).toBe(false);
  });

  it('resetConversation sets conversationId to null', () => {
    render(<HookWrapper userId={userId} token={token} />);
    act(() => {
      (window as unknown as { hook: ConversationHookReturn }).hook.setConversationId('abc123');
      (window as unknown as { hook: ConversationHookReturn }).hook.resetConversation();
    });
    const hook = (window as unknown as { hook: ConversationHookReturn }).hook;
    expect(hook.conversationId).toBeNull();
  });
});
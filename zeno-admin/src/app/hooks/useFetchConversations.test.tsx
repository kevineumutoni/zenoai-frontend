import { renderHook, act } from "@testing-library/react";
import { useConversation } from "./useFetchConversations";
import { createConversation } from "../utils/fetchConversation";

jest.mock("../utils/fetchConversation", () => ({
  createConversation: jest.fn(),
}));

describe("useConversation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

 
  it("should initialize conversation successfully", async () => {
    (createConversation as jest.Mock).mockResolvedValueOnce({
      conversation_id: "abc123",
    });

    const { result } = renderHook(() =>
      useConversation(1, "fake-token")
    );

    let returnedId: string | null = null;
    await act(async () => {
      returnedId = await result.current.initConversation();
    });

    expect(createConversation).toHaveBeenCalledWith(1, "fake-token");
    expect(result.current.conversationId).toBe("abc123");
    expect(returnedId).toBe("abc123");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle errors during initialization", async () => {
    (createConversation as jest.Mock).mockRejectedValueOnce(
      new Error("Server error")
    );

    const { result } = renderHook(() =>
      useConversation(1, "fake-token")
    );

    await act(async () => {
      const cid = await result.current.initConversation();
      expect(cid).toBeNull();
    });

    expect(result.current.error).toBe("Server error");
    expect(result.current.conversationId).toBeNull();
  });

  it("should reset conversation", async () => {
    const { result } = renderHook(() => useConversation());
    act(() => {
      result.current.setConversationId("test1");
    });
    expect(result.current.conversationId).toBe("test1");

    act(() => {
      result.current.resetConversation();
    });
    expect(result.current.conversationId).toBeNull();
  });

});

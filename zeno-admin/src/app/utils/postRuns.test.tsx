import { createRun, fetchRunById } from "../utils/postRuns";

describe("createRun", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should send POST request with JSON body when no files are provided", async () => {
    const mockResponse = { id: 1, userInput: "Hello" };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await createRun("123", "Hello", "fake-token");

    expect(global.fetch).toHaveBeenCalledWith("/api/conversationruns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token fake-token",
      },
      body: JSON.stringify({ conversationId: "123", userInput: "Hello" }),
    });

    expect(result).toEqual(mockResponse);
  });

  it("should send POST request with FormData when files are provided", async () => {
    const mockResponse = { id: 2, userInput: "File test" };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    // Mock File
    const mockFile = new File(["test content"], "test.txt", { type: "text/plain" });

    const result = await createRun(null, "File test", "fake-token", [mockFile]);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const call = (global.fetch as jest.Mock).mock.calls[0];
    const requestInit = call[1];

    // Ensure FormData is used
    expect(requestInit.body instanceof FormData).toBe(true);
    expect(result).toEqual(mockResponse);
  });

  it("should throw error if response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Something went wrong" }),
    } as Response);

    await expect(createRun(null, "Bad request")).rejects.toThrow("Something went wrong");
  });
});

describe("fetchRunById", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should fetch run by ID with proper headers", async () => {
    const mockResponse = { id: 123, userInput: "Fetched" };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchRunById(123, "fake-token");

    expect(global.fetch).toHaveBeenCalledWith("/api/run?id=123", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token fake-token",
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it("should throw error if run fetch fails", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Run not found" }),
    } as Response);

    await expect(fetchRunById(999)).rejects.toThrow("Run not found");
  });
});

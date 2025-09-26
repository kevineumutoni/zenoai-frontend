import { fetchRuns, postRun } from "./fetchRuns";

import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn((key) => {
        if (key === "token") return "mock-token";
        return null;
      }),
      setItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

describe("fetchRuns", () => {
  it("throws error if not logged in", async () => {
    window.localStorage.getItem = jest.fn(() => null);
    await expect(fetchRuns()).rejects.toThrow("Please log in to access system health data.");
  });

  it("fetches runs and returns data", async () => {
    const mockData = [{ id: 1, status: "ok" }];
    fetchMock.mockResponseOnce(JSON.stringify(mockData));
    const result = await fetchRuns();
    expect(fetchMock).toHaveBeenCalledWith("/api/runs", expect.objectContaining({
      method: "GET",
      headers: expect.objectContaining({
        "Content-Type": "application/json",
        "Authorization": "Token mock-token",
      }),
    }));
    expect(result).toEqual(mockData);
  });

  it("throws error on fetch failure", async () => {
    fetchMock.mockResponseOnce("fail!", { status: 500 });
    await expect(fetchRuns()).rejects.toThrow("fail!");
  });
});

describe("postRun", () => {
  it("throws error if not logged in", async () => {
    window.localStorage.getItem = jest.fn(() => null);
    await expect(postRun("test", [])).rejects.toThrow("Please log in to access system health data.");
  });

  it("posts a run and returns response", async () => {
    const mockData = { id: 2, user_input: "hi" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));
    const result = await postRun("hi", []);
    const lastCall = fetchMock.mock.calls[0];
    expect(lastCall[0]).toBe("/api/runs");
    expect(lastCall[1]?.method).toBe("POST");
    expect(lastCall[1]?.headers).toEqual({ "Authorization": "Token mock-token" });
    expect(result).toEqual(mockData);
  });

  it("throws error on post failure", async () => {
    fetchMock.mockResponseOnce("Unable to create run.", { status: 400 });
    await expect(postRun("fail", [])).rejects.toThrow("Unable to create run.");
  });
});
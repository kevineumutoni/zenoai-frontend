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

<<<<<<< HEAD
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
=======
  it("falls back to default error message if response.text() is empty", async () => {
    localStorage.setItem("token", "dummy-token");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: jest.fn().mockResolvedValue(""),
    });
>>>>>>> c23d54d (okay)

  it("throws error on post failure", async () => {
    fetchMock.mockResponseOnce("Unable to create run.", { status: 400 });
    await expect(postRun("fail", [])).rejects.toThrow("Unable to create run.");
  });
});

describe("postRun", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it("throws error if no token in localStorage", async () => {
    await expect(postRun("input", [])).rejects.toThrow(
      "Please log in to access system health data."
    );
  });

  it("throws error if fetch response is not ok", async () => {
    localStorage.setItem("token", "dummy-token");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: jest.fn().mockResolvedValue("Post error"),
    });

    await expect(postRun("input", [])).rejects.toThrow("Post error");
  });

  it("falls back to default error message if response.text() is empty", async () => {
    localStorage.setItem("token", "dummy-token");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: jest.fn().mockResolvedValue(""),
    });

    await expect(postRun("input", [])).rejects.toThrow(
      "Unable to create run. Please try again later."
    );
  });

  it("returns data if fetch succeeds", async () => {
    localStorage.setItem("token", "dummy-token");
    const mockData = { id: 1, status: "created" };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const data = await postRun("input", []);
    expect(data).toEqual(mockData);

    expect(fetch).toHaveBeenCalledWith(
      "/api/runs",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Token dummy-token",
        }),
        body: expect.any(FormData),
      })
    );
  });

  it("throws error with fetch failure message", async () => {
    localStorage.setItem("token", "dummy-token");
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    await expect(postRun("input", [])).rejects.toThrow("Network error");
  });

  it("appends files to FormData", async () => {
    localStorage.setItem("token", "dummy-token");
    const mockFile = new File(["foo"], "foo.txt", { type: "text/plain" });
    const mockData = { id: 2, status: "created" };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    await postRun("test input", [mockFile]);
    const fetchArgs = (fetch as jest.Mock).mock.calls[0][1];
    expect(fetchArgs.body instanceof FormData).toBe(true);
    expect(fetchArgs.body.get("user_input")).toBe("test input");
    expect(fetchArgs.body.getAll("files")).toContain(mockFile);
  });
});
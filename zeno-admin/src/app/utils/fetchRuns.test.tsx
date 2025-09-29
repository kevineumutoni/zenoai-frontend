import { fetchRuns, postRun } from "./fetchRuns";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

global.fetch = jest.fn();

describe("fetchRuns", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it("throws error if no token in localStorage", async () => {
    await expect(fetchRuns()).rejects.toThrow(
      "Please log in to access system health data."
    );
  });

  it("throws error if fetch response is not ok", async () => {
    localStorage.setItem("token", "dummy-token");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: jest.fn().mockResolvedValue("Custom server error message"),
    });

    await expect(fetchRuns()).rejects.toThrow("Custom server error message");
  });

  it("falls back to default error message if response.text() is empty", async () => {
    localStorage.setItem("token", "dummy-token");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: jest.fn().mockResolvedValue(""),
    });

    await expect(fetchRuns()).rejects.toThrow(
      "Unable to fetch system data. Please try again later."
    );
  });

  it("returns data if fetch succeeds", async () => {
    localStorage.setItem("token", "dummy-token");
    const mockData = [{ id: 1, status: "completed" }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const data = await fetchRuns();
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      "/api/runs",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Token dummy-token",
        }),
      })
    );
  });

  it("throws error with fetch failure message", async () => {
    localStorage.setItem("token", "dummy-token");
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchRuns()).rejects.toThrow("Network error");
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
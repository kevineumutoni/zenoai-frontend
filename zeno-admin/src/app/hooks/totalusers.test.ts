import { renderHook, waitFor } from "@testing-library/react";
import { fetchUsers } from "../utils/fetchUsers";
import { useUserStats } from "./totalusers";

jest.mock("../utils/fetchUsers");

const mockedFetchUsers = fetchUsers as jest.Mock;
describe("useUserStats hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns correct total and new user counts", async () => {
    const now = new Date();

 const users = [
  {
    first_name: "Alice",
    last_name: "Smith",
    email: "alice@example.com",
    role: "admin",
    created_at: "2023-05-10T12:00:00Z",
    image: "",
  },
  {
    first_name: "Bob",
    last_name: "Jones",
    email: "bob@example.com",
    role: "user",
    created_at: "2023-06-15T12:00:00Z",
    image: "",
  },
];

    mockedFetchUsers.mockResolvedValue(users as any);

    const { result } = renderHook(() => useUserStats());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.total_users).toBe(2);
    expect(result.current.new_users).toBe(0); 
    expect(result.current.error).toBeNull();
  });

  it("returns error information on fetch failure", async () => {
    mockedFetchUsers.mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() => useUserStats());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.total_users).toBe(0);
    expect(result.current.new_users).toBe(0);
    expect(result.current.error).toBe("Fetch failed");
  });
});

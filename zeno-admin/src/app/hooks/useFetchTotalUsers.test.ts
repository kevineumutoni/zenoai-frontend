import { renderHook, waitFor } from "@testing-library/react";
import { fetchUsers } from "../utils/fetchUsers";
import { useUserStats } from "./useFetchTotalUsers";

jest.mock("../utils/fetchUsers");

interface User {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
  image: string;
}

const mockedFetchUsers = fetchUsers as jest.Mock;
describe("useUserStats hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns correct total and new user counts", async () => {
    const users: User[] = [
      {
        first_name: "Meron",
        last_name: "Gebru",
        email: "meron@example.com",
        role: "admin",
        created_at: "2023-05-10T12:00:00Z",
        image: "",
      },
      {
        first_name: "Jane",
        last_name: "Kamau",
        email: "janeb@example.com",
        role: "user",
        created_at: "2023-06-15T12:00:00Z",
        image: "",
      },
    ];

    mockedFetchUsers.mockResolvedValue(users);

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
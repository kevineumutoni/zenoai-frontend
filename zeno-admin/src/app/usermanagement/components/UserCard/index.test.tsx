import React from "react";
import { render, screen } from "@testing-library/react";
import UserStatsContainer from ".";

jest.mock("../../../hooks/totalusers", () => ({
  useUserStats: jest.fn(),
}));

import { useUserStats } from "../../../hooks/totalusers";

describe("UserStatsContainer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading text while loading", () => {
    (useUserStats as jest.Mock).mockReturnValue({
      total_users: 0,
      new_users: 0,
      loading: true,
      error: null,
    });
    render(<UserStatsContainer />);
    expect(screen.getByText(/Loading user stats/i)).toBeInTheDocument();
  });

  it("shows error message on error", () => {
    (useUserStats as jest.Mock).mockReturnValue({
      total_users: 0,
      new_users: 0,
      loading: false,
      error: "Failed to fetch",
    });
    render(<UserStatsContainer />);
    expect(screen.getByText(/Error loading user stats/i)).toBeInTheDocument();
  });

  it("shows total and new users when data is loaded", () => {
    (useUserStats as jest.Mock).mockReturnValue({
      total_users: 100,
      new_users: 10,
      loading: false,
      error: null,
    });
    render(<UserStatsContainer />);
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("+10 this week")).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import UsersTable from ".";

jest.mock("../../../hooks/usefetchUsers", () => ({
  useUsers: jest.fn(),
}));

const mockUsers = [
  {
    first_name: "Alice",
    last_name: "Smith",
    email: "alice@example.com",
    created_at: "2024-09-01T10:00:00Z",
    role: "admin",
    image: "",
  },
  {
    first_name: "Bob",
    last_name: "Brown",
    email: "bob@example.com",
    created_at: "2024-08-15T12:00:00Z",
    role: "user",
    image: "",
  },
];

describe("UsersTable", () => {
  it("shows loading state", () => {
    const useUsers = require("../../../hooks/usefetchUsers").useUsers;
    useUsers.mockReturnValue({ users: [], loading: true, error: null });
    render(<UsersTable />);
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
  });

  it("shows error message", () => {
    const useUsers = require("../../../hooks/usefetchUsers").useUsers;
    useUsers.mockReturnValue({ users: [], loading: false, error: "Failed" });
    render(<UsersTable />);
    expect(screen.getByText(/error loading users/i)).toBeInTheDocument();
  });

  it("shows users", () => {
    const useUsers = require("../../../hooks/usefetchUsers").useUsers;
    useUsers.mockReturnValue({ users: mockUsers, loading: false, error: null });
    render(<UsersTable />);
    expect(screen.getByText(/alice smith/i)).toBeInTheDocument();
    expect(screen.getByText(/bob brown/i)).toBeInTheDocument();
    expect(screen.getByText(/alice@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/bob@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    expect(screen.getByText(/user/i)).toBeInTheDocument();
  });

  it("shows 'No users found.' when users is empty", () => {
    const useUsers = require("../../../hooks/usefetchUsers").useUsers;
    useUsers.mockReturnValue({ users: [], loading: false, error: null });
    render(<UsersTable />);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });
});
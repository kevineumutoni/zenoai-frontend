import React from "react";
import { render, screen, fireEvent} from "@testing-library/react";
import UsersTable from ".";

function MockCalendarDropdown(props: { onDateChange: (start: Date, end: Date) => void }) {
  return <button onClick={() => props.onDateChange(new Date("2023-01-01"), new Date("2023-12-31"))}>Set Date</button>;
}
MockCalendarDropdown.displayName = "MockCalendarDropdown";

function MockDropDown(props: { selected: string; options: string[]; onSelect: (value: string) => void }) {
  return (
    <select
      value={props.selected}
      onChange={(e) => props.onSelect(e.target.value)}
      data-testid="role-dropdown"
    >
      <option value="all">all</option>
      {props.options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
MockDropDown.displayName = "MockDropDown";

jest.mock("../../../hooks/useFetchUsers", () => ({
  useUsers: jest.fn(),
}));

jest.mock("../../../sharedComponents/CalendarDropdown", () => ({
  __esModule: true,
  default: MockCalendarDropdown,
}));

jest.mock("../DropDown", () => ({
  __esModule: true,
  default: MockDropDown,
}));

import { useUsers } from "../../../hooks/useFetchUsers";

describe("UsersTable component", () => {
  const usersMock = [
    {
      first_name: "Meron",
      last_name: "Mary",
      email: "meron@example.com",
      role: "admin",
      created_at: "2023-05-10T12:00:00Z",
      image: "",
    },
    {
      first_name: "Ann",
      last_name: "Kendi",
      email: "ann@example.com",
      role: "user",
      created_at: "2023-06-15T12:00:00Z",
      image: "",
    },
  ];

  it("shows loading state", () => {
    (useUsers as jest.Mock).mockReturnValue({ users: [], loading: true, error: null });
    render(<UsersTable />);
    expect(screen.getByText(/Loading users.../i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    (useUsers as jest.Mock).mockReturnValue({ users: [], loading: false, error: "Failed to fetch" });
    render(<UsersTable />);
    expect(screen.getByText(/Error loading users: Failed to fetch/i)).toBeInTheDocument();
  });

  it("renders users and filters by search, role, and date", async () => {
    (useUsers as jest.Mock).mockReturnValue({ users: usersMock, loading: false, error: null });
    render(<UsersTable />);

    expect(screen.getByText("Meron Mary")).toBeInTheDocument();
    expect(screen.getByText("Ann Kendi")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Search by name or email/i), { target: { value: "Meron" } });
    expect(screen.getByText("Meron Mary")).toBeInTheDocument();
    expect(screen.queryByText("Ann Kendi")).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Search by name or email/i), { target: { value: "" } });
    fireEvent.change(screen.getByTestId("role-dropdown"), { target: { value: "admin" } });
    expect(screen.getByText("Meron Mary")).toBeInTheDocument();
    expect(screen.queryByText("Ann Kendi")).not.toBeInTheDocument();

    fireEvent.change(screen.getByTestId("role-dropdown"), { target: { value: "all" } });
    fireEvent.click(screen.getByText("Set Date")); 

    expect(screen.getByText("Meron Mary")).toBeInTheDocument();
    expect(screen.getByText("Ann Kendi")).toBeInTheDocument();

  });

  it("shows no users found when filters exclude all", () => {
    (useUsers as jest.Mock).mockReturnValue({ users: usersMock, loading: false, error: null });
    render(<UsersTable />);

    fireEvent.change(screen.getByPlaceholderText(/Search by name or email/i), { target: { value: "nomatch" } });
    expect(screen.getByText("No users found.")).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ProfilePage from "./page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("../hooks/useFetchAdmin", () => {
  return () => ({
    user: {
      id: 1,
      role: "admin",
      first_name: "Kevin",
      last_name: "Brown",
      email: "kevin@example.com",
      date_joined: "2023-07-01T08:00:00Z",
      image: "/avatar.png",
      password: "",
    },
    loading: false,
    error: null,
    updateAdmin: jest.fn().mockResolvedValue({
      id: 1,
      role: "admin",
      first_name: "Kevin",
      last_name: "Brown",
      email: "kevin@example.com",
      date_joined: "2023-07-01T08:00:00Z",
      image: "/avatar.png",
      password: "",
    }),
    refetch: jest.fn(),
  });
});

jest.mock("next/image", () => {
  return function MockImage(props: { src: string; alt: string; width?: number; height?: number; className?: string }) {
    return (
      <div
        data-testid="mock-next-image"
        data-src={props.src}
        data-alt={props.alt}
        data-width={props.width ?? ""}
        data-height={props.height ?? ""}
        className={props.className}
      />
    );
  };
});

describe("ProfilePage", () => {
  it("renders loading state", () => {
    jest.mock("../hooks/useFetchAdmin", () => {
      return () => ({
        user: null,
        loading: true,
        error: null,
        updateAdmin: jest.fn(),
        refetch: jest.fn(),
      });
    });
    render(<ProfilePage />);
    expect(screen.getByText(/Loading profile/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    jest.mock("../hooks/useFetchAdmin", () => {
      return () => ({
        user: null,
        loading: false,
        error: "Network error",
        updateAdmin: jest.fn(),
        refetch: jest.fn(),
      });
    });
    render(<ProfilePage />);
    expect(screen.getByText(/Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
  });

  it("renders not-found state", () => {
    jest.mock("../hooks/useFetchAdmin", () => {
      return () => ({
        user: null,
        loading: false,
        error: null,
        updateAdmin: jest.fn(),
        refetch: jest.fn(),
      });
    });
    render(<ProfilePage />);
    expect(screen.getByText(/User not found/i)).toBeInTheDocument();
  });

  it("renders profile details and avatar", () => {
    render(<ProfilePage />);
    expect(screen.getByRole("heading", { name: /Profile/i })).toBeInTheDocument();
    expect(screen.getByText(/Kevin/i)).toBeInTheDocument();
    expect(screen.getByText(/Brown/i)).toBeInTheDocument();
    expect(screen.getByText(/kevin@example.com/i)).toBeInTheDocument();
    expect(screen.getByTestId("mock-next-image")).toBeInTheDocument();
  });

  it("enters edit mode and cancels edit", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(screen.queryByRole("button", { name: /Save/i })).not.toBeInTheDocument();
  });

  it("shows password required message if password is missing", async () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    fireEvent.click(screen.getByRole("button", { name: /Save/i }));
    expect(await screen.findByText(/Password is required to update the profile./i)).toBeInTheDocument();
  });

  it("submits and updates profile with password", async () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: "newpass123" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Save/i }));
    });
    expect(await screen.findByText(/Profile updated successfully!/i)).toBeInTheDocument();
  });

  it("shows update failed if updateAdmin throws", async () => {
    jest.mock("../hooks/useFetchAdmin", () => {
      return () => ({
        user: {
          id: 1,
          role: "admin",
          first_name: "Kevin",
          last_name: "Brown",
          email: "kevin@example.com",
          date_joined: "2023-07-01T08:00:00Z",
          image: "/avatar.png",
          password: "",
        },
        loading: false,
        error: null,
        updateAdmin: jest.fn().mockRejectedValue(new Error("fail")),
        refetch: jest.fn(),
      });
    });
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: "newpass123" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Save/i }));
    });
    expect(await screen.findByText(/Update failed./i)).toBeInTheDocument();
  });
});
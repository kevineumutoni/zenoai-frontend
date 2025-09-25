import { render, screen, fireEvent } from "@testing-library/react";
import ChatMessages from "./index";
import React from "react";

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe("ChatMessages", () => {
  it("renders user message for every run", () => {
    const runs = [
      {
        id: "1",
        user_input: "Hello Zeno",
        final_output: "Hello",
        output_artifacts: [],
        status: "completed",
      },
    ];

    render(<ChatMessages runs={runs} onRetry={jest.fn()} userId={1} />);
    expect(screen.getByText("Hello Zeno")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders loading message when status is pending", () => {
    const runs = [
      {
        id: "2",
        user_input: "Test message",
        final_output: "",
        output_artifacts: [],
        status: "pending",
      },
    ];

    render(<ChatMessages runs={runs} onRetry={jest.fn()} userId={1} />);
    expect(screen.getByTestId("loading-message")).toBeInTheDocument();
  });

  it("renders retry button and calls onRetry when clicked", () => {
    const onRetry = jest.fn();
    const runs = [
      {
        id: "3",
        user_input: "Test",
        final_output: "",
        output_artifacts: [],
        status: "failed",
      },
    ];

    render(<ChatMessages runs={runs} onRetry={onRetry} userId={1} />);
    fireEvent.click(screen.getByText("Retry"));
    expect(onRetry).toHaveBeenCalled();
  });
});

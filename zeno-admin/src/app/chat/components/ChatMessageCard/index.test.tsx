import { render, screen } from "@testing-library/react";
import ChatMessage from ".";

describe("ChatMessage", () => {
  it("renders a user message with correct styling", () => {
    render(<ChatMessage role="user" text="Hello World" />);
    const message = screen.getByText("Hello World");
    expect(message).toBeInTheDocument();

    const wrapper = message.closest("div");
    expect(wrapper).toHaveClass("bg-[#9FF8F8]");
  });

  it("renders an agent message with correct styling", () => {
    render(<ChatMessage role="agent" text="Hi, I'm the agent!" />);
    const message = screen.getByText("Hi, I'm the agent!");
    expect(message).toBeInTheDocument();

    const wrapper = message.closest("div");
    expect(wrapper).toHaveClass("bg-[#131F36]");
  });

  it("shows loading state with 3 bouncing dots", () => {
    render(<ChatMessage role="agent" loading />);
    const dots = screen.getAllByRole("presentation");
    expect(dots.length).toBe(3);
  });

  it("renders chart data when artifactType is chart", () => {
    const data = { x: [1, 2, 3], y: [10, 20, 30] };
    render(<ChatMessage role="agent" artifactType="chart" artifactData={data} />);
    expect(screen.getByText(/"x": \[/)).toBeInTheDocument();
  });

  it("renders table data when artifactType is table", () => {
    const tableData = {
      columns: ["Name", "Age"],
      rows: [["Alice", 25], ["Bob", 30]],
    };

    render(<ChatMessage role="agent" artifactType="table" artifactData={tableData} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });
});

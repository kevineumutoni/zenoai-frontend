import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Teaser2 from "./page";

function MockImage(props: { src: string; alt: string; width?: number; height?: number; className?: string }) {
  return <div data-testid="mock-next-image" data-src={props.src} data-alt={props.alt} />;
}
MockImage.displayName = "MockImage";

jest.mock("next/image", () => ({
  __esModule: true,
  default: MockImage,
}));

describe("Teaser2", () => {
  const mockOnGetStarted = jest.fn();
  const mockSetActiveBar = jest.fn();

  const defaultProps = {
    onGetStarted: mockOnGetStarted,
    activeBar: 0,
    setActiveBar: mockSetActiveBar,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the headline and description", () => {
    render(<Teaser2 {...defaultProps} />);
    expect(
      screen.getByRole("heading", { name: /How\s+Zeno AI\s+works\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please watch the video for step-by-step instructions/i)
    ).toBeInTheDocument();
  });

  it("renders the logo image", () => {
    render(<Teaser2 {...defaultProps} />);
    const logo = screen.getByTestId("mock-next-image");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("data-src", "/images/zeno-icon.png");
    expect(logo).toHaveAttribute("data-alt", "Logo");
  });

  it("renders and allows switching between bars", () => {
    render(<Teaser2 {...defaultProps} />);
    const stepButtons = screen.getAllByRole("button", { name: /Go to step/i });
    expect(stepButtons.length).toBe(2);

    fireEvent.click(stepButtons[1]);
    expect(mockSetActiveBar).toHaveBeenCalledWith(1);
  });

  it("shows the active bar with the correct style", () => {
    render(<Teaser2 {...defaultProps} activeBar={1} />);
    const stepButtons = screen.getAllByRole("button", { name: /Go to step/i });
    expect(stepButtons[1]).toHaveClass("bg-cyan-400");
    expect(stepButtons[0]).not.toHaveClass("bg-cyan-400");
  });

  it("calls onGetStarted when Get Started button is clicked", () => {
    render(<Teaser2 {...defaultProps} />);
    const getStartedButton = screen.getByRole("button", { name: /Get Started/i });
    fireEvent.click(getStartedButton);
    expect(mockOnGetStarted).toHaveBeenCalled();
  });
});
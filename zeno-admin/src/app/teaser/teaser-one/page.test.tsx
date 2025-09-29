import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Teaser from "./page";

function MockImage(props: { src: string; alt: string; width?: number; height?: number; className?: string }) {
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
}
MockImage.displayName = "MockImage";

jest.mock("next/image", () => ({
  __esModule: true,
  default: MockImage,
}));

describe("Teaser", () => {
  const mockOnContinue = jest.fn();
  const mockOnSkip = jest.fn();
  const mockSetActiveBar = jest.fn();
  const defaultProps = {
    onContinue: mockOnContinue,
    onSkip: mockOnSkip,
    activeBar: 0,
    setActiveBar: mockSetActiveBar,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the teaser headline and description", () => {
    render(<Teaser {...defaultProps} />);
    expect(
      screen.getByRole("heading", {
        name: /Your Data has a Story\. What if You Could Read it\?/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/transforms complex data into clear actionable foresight/i)
    ).toBeInTheDocument();
  });

  it("renders logo image", () => {
    render(<Teaser {...defaultProps} />);
    const logo = screen.getByTestId("mock-next-image");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("data-src", "/images/zeno-icon.png");
    expect(logo).toHaveAttribute("data-alt", "Logo");
  });

  it("calls onSkip when Skip button is clicked", () => {
    render(<Teaser {...defaultProps} />);
    const skipButton = screen.getByRole("button", { name: /Skip/i });
    fireEvent.click(skipButton);
    expect(mockOnSkip).toHaveBeenCalled();
  });

  it("calls onContinue when Continue button is clicked", () => {
    render(<Teaser {...defaultProps} />);
    const continueButton = screen.getByRole("button", { name: /Continue/i });
    fireEvent.click(continueButton);
    expect(mockOnContinue).toHaveBeenCalled();
  });

  it("renders and allows switching between bars", () => {
    render(<Teaser {...defaultProps} />);
    const stepButtons = screen.getAllByRole("button", { name: /Go to step/i });
    expect(stepButtons.length).toBe(2);

    fireEvent.click(stepButtons[1]);
    expect(mockSetActiveBar).toHaveBeenCalledWith(1);
  });

  it("shows the active bar with the correct style", () => {
    render(<Teaser {...defaultProps} activeBar={1} />);
    const stepButtons = screen.getAllByRole("button", { name: /Go to step/i });
    expect(stepButtons[1]).toHaveClass("bg-cyan-400");
    expect(stepButtons[0]).not.toHaveClass("bg-cyan-400");
  });
});
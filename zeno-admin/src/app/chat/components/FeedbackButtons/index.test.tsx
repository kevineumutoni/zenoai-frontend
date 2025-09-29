import { render, screen, fireEvent } from "@testing-library/react";
import FeedbackButtons from ".";
import { act } from "react";

describe("FeedbackButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    });
  });

  it("opens modal when like button is clicked", () => {
    render(<FeedbackButtons userId={1} textToCopy="Test text" />);

    fireEvent.click(screen.getByLabelText("like"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("copies text to clipboard", async () => {
    render(<FeedbackButtons userId={1} textToCopy="Copy me" />);

    await act(async () => {
      fireEvent.click(screen.getByLabelText("copy"));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Copy me");
  });
});

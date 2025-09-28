import { render, screen, fireEvent } from "@testing-library/react";
import FeedbackModal from ".";
import { useSendFeedback } from "../../../hooks/useFetchFeedback";

jest.mock("../../../hooks/useFetchFeedback");

describe("FeedbackModal", () => {
  const mockSubmitFeedback = jest.fn();
  const mockClear = jest.fn();

  beforeEach(() => {
    (useSendFeedback as jest.Mock).mockReturnValue({
      submitFeedback: mockSubmitFeedback,
      loading: false,
      error: null,
      success: false,
      clear: mockClear,
    });
  });

  it("should render and submit feedback", async () => {
    render(
      <FeedbackModal
        userId={1}
        feedbackType="like"
        token="token"
        onClose={jest.fn()}
      />
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Great job" },
    });

    fireEvent.submit(screen.getByRole("form"));

    expect(mockSubmitFeedback).toHaveBeenCalledWith({
      feedbackType: "like",
      comment: "Great job",
      userId: 1,
      token: "token",
    });
  });

  it("should display error if present", () => {
    (useSendFeedback as jest.Mock).mockReturnValue({
      submitFeedback: jest.fn(),
      loading: false,
      error: "Failed to send feedback",
      success: false,
      clear: jest.fn(),
    });

    render(
      <FeedbackModal
        userId={1}
        feedbackType="dislike"
        token="token"
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText("Failed to send feedback")).toBeInTheDocument();
  });
});

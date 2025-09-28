import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatInput from "../../../sharedComponents/ChatInput";

const mockSendMessage = jest.fn();

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mock-url");
  global.URL.revokeObjectURL = jest.fn();
});

describe("ChatInput Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    Object.defineProperty(navigator, "mediaDevices", {
      writable: true,
      value: {
        getUserMedia: jest.fn().mockResolvedValue({
          getTracks: jest.fn(() => [{ stop: jest.fn() }]),
        }),
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders input and buttons disabled initially", () => {
    render(<ChatInput user={{ id: 1, token: "34dvfr" }} sendMessage={mockSendMessage} />);
    expect(screen.getByPlaceholderText("Ask Zeno")).toBeInTheDocument();
    expect(screen.getByTitle("Upload File")).toBeInTheDocument();
    expect(screen.getByTitle("Take Photo")).toBeInTheDocument();
    expect(screen.getByTitle("Send")).toBeDisabled();
  });

  it("enables send button when typing input", () => {
    render(<ChatInput user={{ id: 1, token: "34dvfr" }} sendMessage={mockSendMessage} />);
    const input = screen.getByPlaceholderText("Ask Zeno");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(screen.getByTitle("Send")).not.toBeDisabled();
  });

  it("disables send button when input cleared again", () => {
    render(<ChatInput user={{ id: 1, token: "34dvfr" }} sendMessage={mockSendMessage} />);
    const input = screen.getByPlaceholderText("Ask Zeno");
    const sendBtn = screen.getByTitle("Send");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(sendBtn).not.toBeDisabled();
    fireEvent.change(input, { target: { value: "" } });
    expect(sendBtn).toBeDisabled();
  });

  it("adds valid files on file input change and shows preview", () => {
    render(<ChatInput user={{ id: 1, token: "34dvfr" }} sendMessage={mockSendMessage} />);
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    const validFile = new File(["dummy"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    expect(screen.getByText((content) => content.includes("test.pdf"))).toBeInTheDocument();
  });

  it("alerts and ignores invalid files on file input", () => {
    render(<ChatInput user={{ id: 1, token: "34dvfr" }} sendMessage={mockSendMessage} />);
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    const invalidFile = new File(["dummy"], "test.exe", { type: "application/x-msdownload" });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    expect(window.alert).toHaveBeenCalledWith(
      "Some files are invalid. Only PDF, JPEG, PNG, or text files under 10MB are allowed."
    );
    expect(screen.queryByText((content) => content.includes("test.exe"))).not.toBeInTheDocument();
  });

  it("removes a file when remove button clicked", () => {
    render(<ChatInput user={{ id: 1, token: "34dvfr" }} sendMessage={mockSendMessage} />);
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    const file = new File(["dummy"], "remove-me.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(screen.getByText((content) => content.includes("remove-me.txt"))).toBeInTheDocument();
    const removeBtn = screen.getByLabelText("Remove file");
    fireEvent.click(removeBtn);
    expect(screen.queryByText((content) => content.includes("remove-me.txt"))).not.toBeInTheDocument();
  });

  it("disables submit if no input and no files", () => {
    render(<ChatInput user={{ id: 1, token: "34dvfr" }} sendMessage={mockSendMessage} />);
    expect(screen.getByTitle("Send")).toBeDisabled();
  });

  it("calls sendMessage on valid submit and resets input & files", async () => {
    mockSendMessage.mockResolvedValueOnce({ id: 123, user_input: "Test run" });
    const { container } = render(<ChatInput user={{ id: 1, token: "34dvfr" }} sendMessage={mockSendMessage} />);
    const input = screen.getByPlaceholderText("Ask Zeno");
    fireEvent.change(input, { target: { value: "Test run" } });
    const form = container.querySelector("form");
    fireEvent.submit(form!);
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        conversationId: null,
        userInput: "Test run",
        files: [],
        filePreviews: undefined,
      });
    });
    expect(input).toHaveValue("");
  });

  it("alerts user if camera upload attempted but not supported", () => {
    Object.defineProperty(navigator, "mediaDevices", {
      writable: true,
      value: undefined,
    });
    render(<ChatInput user={{ id: 1, token: "34dvfr" }} sendMessage={mockSendMessage} />);
    const cameraButton = screen.getByTitle("Take Photo");
    fireEvent.click(cameraButton);
    expect(window.alert).toHaveBeenCalledWith("Camera not supported on this device.");
  });

  it("calls sendMessage with filePreviews when files are uploaded", async () => {
    mockSendMessage.mockResolvedValueOnce({ id: 123, user_input: "1 file(s) attached" });
    const { container } = render(<ChatInput user={{ id: 1, token: "34dvfr" }} sendMessage={mockSendMessage} />);
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    const file = new File(["dummy"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    const form = container.querySelector("form");
    fireEvent.submit(form!);
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          files: [file],
          filePreviews: expect.arrayContaining([
            expect.objectContaining({
              file: file,
              previewUrl: expect.any(String),
            }),
          ]),
        })
      );
    });
  });
});
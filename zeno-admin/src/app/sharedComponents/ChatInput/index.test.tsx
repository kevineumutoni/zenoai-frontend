import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatInput from ".";

global.URL.createObjectURL = jest.fn().mockImplementation(() => 'mock-blob-url');
global.URL.revokeObjectURL = jest.fn();

const mockSendMessage = jest.fn();

describe("ChatInput Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    
    Object.defineProperty(navigator, 'mediaDevices', {
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


  it("removes a file when remove button clicked", async () => {
    render(
      <ChatInput 
        user={{ id: 1, token: "abc" }} 
        sendMessage={mockSendMessage}
      />
    );
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    const file = new File(["dummy"], "remove-me.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText("remove-me.txt")).toBeInTheDocument();
    });

    const removeBtn = screen.getByLabelText("Remove file");
    fireEvent.click(removeBtn);
    
    await waitFor(() => {
      expect(screen.queryByText("remove-me.txt")).not.toBeInTheDocument();
    });
  });


  it("calls sendMessage with filePreviews when files are uploaded", async () => {
    mockSendMessage.mockResolvedValueOnce({ id: 123, user_input: "1 file(s) attached" });

    const { container } = render(
      <ChatInput 
        user={{ id: 1, token: "abc" }} 
        sendMessage={mockSendMessage}
      />
    );
    
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    const file = new File(["dummy"], "test.pdf", { type: "application/pdf" });
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("test.pdf")).toBeInTheDocument();
    });

    const form = container.querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          files: [file],
          filePreviews: expect.arrayContaining([
            expect.objectContaining({
              file: file,
              previewUrl: 'mock-blob-url', 
            })
          ])
        })
      );
    });
  });
});
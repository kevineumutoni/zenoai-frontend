// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import ChatInput from ".";
// import { useRuns } from "../../hooks/usepostRuns";

// jest.mock("../../hooks/usepostRuns");

// describe("ChatInput Component", () => {
//   const mockOnRunCreated = jest.fn();
//   const mockSendMessage = jest.fn();

//   beforeEach(() => {
//     jest.clearAllMocks();
//     (useRuns as jest.Mock).mockReturnValue({ sendMessage: mockSendMessage });

//     jest.spyOn(window, "alert").mockImplementation(() => {});
//     (navigator.mediaDevices as any) = {
//       getUserMedia: jest.fn().mockResolvedValue({
//         getTracks: jest.fn(() => [{ stop: jest.fn() }]),
//       }),
//     };
//   });

//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   it("renders input and buttons disabled initially", () => {
//     render(<ChatInput onRunCreated={mockOnRunCreated} user={{ id: 1, token: "abc" }} />);
//     expect(screen.getByPlaceholderText("Ask Zeno")).toBeInTheDocument();
//     expect(screen.getByTitle("Upload File")).toBeInTheDocument();
//     expect(screen.getByTitle("Take Photo")).toBeInTheDocument();
//     expect(screen.getByTitle("Send")).toBeDisabled();
//   });

//   it("enables send button when typing input", () => {
//     render(<ChatInput onRunCreated={mockOnRunCreated} user={{ id: 1, token: "abc" }} />);
//     const input = screen.getByPlaceholderText("Ask Zeno");
//     fireEvent.change(input, { target: { value: "Hello" } });
//     expect(screen.getByTitle("Send")).not.toBeDisabled();
//   });

//   it("disables send button when input cleared again", () => {
//     render(<ChatInput onRunCreated={mockOnRunCreated} user={{ id: 1, token: "abc" }} />);
//     const input = screen.getByPlaceholderText("Ask Zeno");
//     const sendBtn = screen.getByTitle("Send");

//     fireEvent.change(input, { target: { value: "Hello" } });
//     expect(sendBtn).not.toBeDisabled();

//     fireEvent.change(input, { target: { value: "" } });
//     expect(sendBtn).toBeDisabled();
//   });

//   it("adds valid files on file input change and shows preview", () => {
//     render(<ChatInput onRunCreated={mockOnRunCreated} user={{ id: 1, token: "abc" }} />);
//     const fileInput = document.getElementById("file-upload") as HTMLInputElement;
//     const validFile = new File(["dummy"], "test.pdf", { type: "application/pdf" });

//     fireEvent.change(fileInput, { target: { files: [validFile] } });
//     expect(screen.getByText("test.pdf")).toBeInTheDocument();
//   });

//   it("alerts and ignores invalid files on file input", () => {
//     render(<ChatInput onRunCreated={mockOnRunCreated} user={{ id: 1, token: "abc" }} />);
//     const fileInput = document.getElementById("file-upload") as HTMLInputElement;
//     const invalidFile = new File(["dummy"], "test.exe", {
//       type: "application/x-msdownload",
//     });

//     fireEvent.change(fileInput, { target: { files: [invalidFile] } });

//     expect(window.alert).toHaveBeenCalledWith(
//       "Some files are invalid. Only PDF, JPEG, PNG, or text files under 10MB are allowed."
//     );
//     expect(screen.queryByText("test.exe")).not.toBeInTheDocument();
//   });

//   it("removes a file when remove button clicked", () => {
//     render(<ChatInput onRunCreated={mockOnRunCreated} user={{ id: 1, token: "abc" }} />);
//     const fileInput = document.getElementById("file-upload") as HTMLInputElement;
//     const file = new File(["dummy"], "remove-me.txt", { type: "text/plain" });

//     fireEvent.change(fileInput, { target: { files: [file] } });
//     expect(screen.getByText("remove-me.txt")).toBeInTheDocument();

//     const removeBtn = screen.getByLabelText("Remove file");
//     fireEvent.click(removeBtn);
//     expect(screen.queryByText("remove-me.txt")).not.toBeInTheDocument();
//   });

//   it("disables submit if no input and no files", () => {
//     render(<ChatInput onRunCreated={mockOnRunCreated} user={{ id: 1, token: "abc" }} />);
//     expect(screen.getByTitle("Send")).toBeDisabled();
//   });

//   it("calls sendMessage and onRunCreated on valid submit and resets input & files", async () => {
//     mockSendMessage.mockResolvedValueOnce({ id: 123, user_input: "Test run" });

//     const { container } = render(<ChatInput onRunCreated={mockOnRunCreated} user={{ id: 1, token: "abc" }} />);
//     const input = screen.getByPlaceholderText("Ask Zeno");
//     fireEvent.change(input, { target: { value: "Test run" } });

//     const form = container.querySelector("form");
//     fireEvent.submit(form!);

//     await waitFor(() => {
//       expect(mockSendMessage).toHaveBeenCalledWith({
//         conversationId: null,
//         userInput: "Test run",
//         files: [],
//       });
//       expect(mockOnRunCreated).toHaveBeenCalledWith({
//         id: 123,
//         user_input: "Test run",
//       });
//     });

//     expect(input).toHaveValue("");
//   });

//   it("handles errors on submit gracefully", async () => {
//     mockSendMessage.mockRejectedValueOnce(new Error("Failed request"));
//     const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

//     const { container } = render(<ChatInput onRunCreated={mockOnRunCreated} user={{ id: 1, token: "abc" }} />);
//     const input = screen.getByPlaceholderText("Ask Zeno");
//     fireEvent.change(input, { target: { value: "Error test" } });

//     const form = container.querySelector("form");
//     fireEvent.submit(form!);

//     await waitFor(() => {
//       expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
//       expect(mockOnRunCreated).not.toHaveBeenCalled();
//     });

//     consoleSpy.mockRestore();
//   });

//   it("alerts user if camera upload attempted but not supported", () => {
//     (navigator.mediaDevices as any) = undefined;
//     render(<ChatInput onRunCreated={mockOnRunCreated} user={{ id: 1, token: "abc" }} />);
//     const cameraButton = screen.getByTitle("Take Photo");

//     fireEvent.click(cameraButton);
//     expect(window.alert).toHaveBeenCalledWith("Camera not supported on this device.");
//   });
// });

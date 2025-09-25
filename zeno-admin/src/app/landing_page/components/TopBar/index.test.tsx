import { render, screen, fireEvent } from "@testing-library/react";
import DashboardTopBar from "../TopBar";
import { useRouter } from "next/navigation";


jest.mock("next/navigation", () => ({
 useRouter: jest.fn(),
}));


describe("DashboardTopBar", () => {
 let pushMock: jest.Mock;


 beforeEach(() => {
   pushMock = jest.fn();
   (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
 });


 it("renders User Guide, Sign in, and Sign up buttons", () => {
   render(<DashboardTopBar />);
   expect(screen.getByText("User Guide")).toBeInTheDocument();
   expect(screen.getByText("Sign in")).toBeInTheDocument();
   expect(screen.getByText("Sign up")).toBeInTheDocument();
 });


 it("shows and closes the Coming Soon modal when User Guide is clicked", () => {
   render(<DashboardTopBar />);
   fireEvent.click(screen.getByText("User Guide"));
   expect(screen.getByText("Coming soon")).toBeInTheDocument();


   fireEvent.click(screen.getByText("Close"));
   expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();
 });


 it("navigates to /signin and /signup", () => {
   render(<DashboardTopBar />);
   fireEvent.click(screen.getByText("Sign in"));
   expect(pushMock).toHaveBeenCalledWith("/signin");
   fireEvent.click(screen.getByText("Sign up"));
   expect(pushMock).toHaveBeenCalledWith("/signup");
 });
});

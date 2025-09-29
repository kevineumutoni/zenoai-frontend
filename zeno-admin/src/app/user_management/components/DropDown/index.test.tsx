import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import CustomDropdown from ".";

const options = ["all", "user", "admin"];

describe("CustomDropdown", () => {
    test("renders the button with the selected value", () => {
        render(<CustomDropdown options={options} selected="all" onSelect={() => { }} />);
        expect(screen.getByRole("button")).toHaveTextContent(/all/i);
    });

    test("opens dropdown menu on button click", () => {
        render(<CustomDropdown options={options} selected="all" onSelect={() => { }} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(screen.getByTestId("dropdown-options")).toBeInTheDocument();
    });

    test("displays all options when open", () => {
        render(<CustomDropdown options={options} selected="all" onSelect={() => { }} />);
        fireEvent.click(screen.getByRole("button"));
        const list = screen.getByTestId("dropdown-options");
        options.forEach((option) => {
            expect(within(list).getAllByText(new RegExp(option, "i")).length).toBeGreaterThan(0);
        });
    });

    test("calls onSelect with correct value and closes dropdown on option click", () => {
        const onSelectMock = jest.fn();
        render(<CustomDropdown options={options} selected="all" onSelect={onSelectMock} />);
        fireEvent.click(screen.getByRole("button"));
        const list = screen.getByTestId("dropdown-options");
        const optionToSelect = within(list).getByText(/admin/i);
        fireEvent.click(optionToSelect);
        expect(onSelectMock).toHaveBeenCalledWith("admin");
        expect(screen.queryByTestId("dropdown-options")).not.toBeInTheDocument();
    });
});

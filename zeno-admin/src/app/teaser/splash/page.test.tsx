import React from "react";
import { render, screen } from "@testing-library/react";
import SplashScreen from "./page";


jest.mock("next/image", () => (props: any) => {

  return <img {...props} />;
});

describe("SplashScreen", () => {
  it("renders the splash screen with the logo", () => {
    render(<SplashScreen />);
    const logo = screen.getByAltText("zeno-logo.png");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/images/zeno.png");
  });

  it("calls onTimeout after 2 seconds", () => {
    jest.useFakeTimers();
    const onTimeout = jest.fn();
    render(<SplashScreen onTimeout={onTimeout} />);
    expect(onTimeout).not.toHaveBeenCalled();
    jest.advanceTimersByTime(2000);
    expect(onTimeout).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("clears the timer on unmount", () => {
    jest.useFakeTimers();
    const onTimeout = jest.fn();
    const { unmount } = render(<SplashScreen onTimeout={onTimeout} />);
    unmount();
    jest.advanceTimersByTime(2000);
    expect(onTimeout).not.toHaveBeenCalled();
    jest.useRealTimers();
  });
});
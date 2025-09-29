import React from "react";
import { render, screen } from "@testing-library/react";
import SplashScreen from "./page";

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

describe("SplashScreen", () => {
  it("renders the splash screen with the logo", () => {
    render(<SplashScreen />);
    const logo = screen.getByTestId("mock-next-image");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("data-src", "/images/zeno.png");
    expect(logo).toHaveAttribute("data-alt", "zeno-logo.png");
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
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import SidebarNav from '.';
import { useRouter, usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe('SidebarNav', () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    cleanup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls router.push and sets active nav item class on click', () => {
    render(<SidebarNav />);
    const navButtons = screen.getAllByTestId('nav-item');

    expect(navButtons[0]).toHaveClass('bg-[#0A1A2E]');
    navButtons.slice(1).forEach(btn => {
      expect(btn).not.toHaveClass('bg-[#0A1A2E]');
    });

    fireEvent.click(navButtons[2]);
    expect(pushMock).toHaveBeenCalledWith('/analytics');

    (usePathname as jest.Mock).mockReturnValue('/analytics');
    cleanup();
    render(<SidebarNav />);
    const updatedNavButtons = screen.getAllByTestId('nav-item');
    expect(updatedNavButtons[2]).toHaveClass('bg-[#0A1A2E]');
    updatedNavButtons.forEach((btn, idx) => {
      if (idx !== 2) {
        expect(btn).not.toHaveClass('bg-[#0A1A2E]');
      }
    });
  });

  it('shows tooltip text on nav item hover', () => {
    render(<SidebarNav />);
    const navButtons = screen.getAllByTestId('nav-item');
    const firstButton = navButtons[0];
    const tooltip = firstButton.querySelector('span');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveClass('opacity-0');
    fireEvent.mouseOver(firstButton);
    expect(tooltip).toHaveTextContent('Dashboard');
  });
});


import { render, screen, fireEvent } from '@testing-library/react';
import SidebarNav from '.';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SidebarNav', () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it('calls router.push with correct path on click and highlights active item', () => {
    render(<SidebarNav />);
    const navButtons = screen.getAllByTestId('nav-item');

    navButtons.forEach((btn, index) => {
      if (index === 0) {
        expect(btn).toHaveClass('bg-[#0A1A2E]');
      } else {
        expect(btn).not.toHaveClass('bg-[#0A1A2E]');
      }
    });

    fireEvent.click(navButtons[2]);

    navButtons.forEach((btn, index) => {
      if (index === 2) {
        expect(btn).toHaveClass('bg-[#0A1A2E]');
      } else {
        expect(btn).not.toHaveClass('bg-[#0A1A2E]');
      }
    });

    expect(pushMock).toHaveBeenCalledWith('/analytics');
  });
  it('shows tooltip text on nav item hover', () => {
    render(<SidebarNav />);
    const navButtons = screen.getAllByTestId('nav-item');
    const firstButton = navButtons[0];
    const tooltipText = 'Dashboard';
    const tooltip = firstButton.querySelector('span');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveClass('opacity-0');
    fireEvent.mouseOver(firstButton);
    expect(tooltip).toHaveTextContent(tooltipText);
  });





});

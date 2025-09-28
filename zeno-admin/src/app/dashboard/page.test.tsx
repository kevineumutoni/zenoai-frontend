import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';

jest.mock('./ModuleUsage', () => ({
  __esModule: true,
  default: function ModuleUsageCardMock() { return <div>ModuleUsageCardMock</div>; }
}));
jest.mock('./UserFeedback', () => ({
  __esModule: true,
  default: function UserFeedbackCardMock() { return <div>UserFeedbackCardMock</div>; }
}));
jest.mock('./WeeklyUsageCard', () => ({
  __esModule: true,
  default: function WeeklyUsageCardMock() { return <div>WeeklyUsageCardMock</div>; }
}));
jest.mock('./RecentSignupCard', () => ({
  __esModule: true,
  default: function RecentSignupsCardMock() { return <div>RecentSignupsCardMock</div>; }
}));
jest.mock('./UserGrowth', () => ({
  __esModule: true,
  default: function UserGrowthLineGraphMock() { return <div>UserGrowthLineGraphMock</div>; }
}));

describe('DashboardPage', () => {
  it('renders dashboard title and all key cards', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText('ModuleUsageCardMock')).toBeInTheDocument();
    expect(screen.getByText('UserFeedbackCardMock')).toBeInTheDocument();
    expect(screen.getByText('UserGrowthLineGraphMock')).toBeInTheDocument();
    expect(screen.getByText('WeeklyUsageCardMock')).toBeInTheDocument();
    expect(screen.getByText('RecentSignupsCardMock')).toBeInTheDocument();
  });
});
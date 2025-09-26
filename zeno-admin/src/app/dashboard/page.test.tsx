import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';

jest.mock('./ModuleUsage', () => () => <div>ModuleUsageCardMock</div>);
jest.mock('./UserFeedback', () => () => <div>UserFeedbackCardMock</div>);
jest.mock('./WeeklyUsageCard', () => () => <div>WeeklyUsageCardMock</div>);
jest.mock('./RecentSignupCard', () => () => <div>RecentSignupsCardMock</div>);
jest.mock('./UserGrowth', () => () => <div>UserGrowthLineGraphMock</div>);

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
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserFeedbackPage from './page';

jest.mock('../hooks/useFetchUserReviews', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('./components/StatsCard', () => (props: any) => (
  <div data-testid={`stats-${props.type}`}>{props.title}: {props.value}</div>
));

jest.mock('./components/Comments', () => (props: any) => (
  <div data-testid="comments">{props.comments.map((comment: any) => comment.text).join(', ')}</div>
));

const mockData = {
  totalReview: 10,
  likes: 7,
  dislikes: 3,
  comments: [
    { text: 'Great one', sentiment: 'Positive' },
    { text: 'Bad one', sentiment: 'Negative' },
    { text: 'Okay', sentiment: 'Positive' },
  ],
};

describe('UserFeedbackPage', () => {
  const useFetchUserFeedback = require('../hooks/useFetchUserReviews').default;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    useFetchUserFeedback.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });
    render(<UserFeedbackPage />);
    expect(screen.getByText(/loading user feedback/i)).toBeInTheDocument();
  });

  it('renders error state and retry button', async () => {
    useFetchUserFeedback.mockReturnValue({
      data: null,
      loading: false,
      error: 'Network error',
    });
    render(<UserFeedbackPage />);
    expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
    expect(screen.getByText(/network error/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders feedback stats and comments', () => {
    useFetchUserFeedback.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });
    render(<UserFeedbackPage />);
    expect(screen.getByTestId('stats-total')).toHaveTextContent('Total Feedback: 10');
    expect(screen.getByTestId('stats-like')).toHaveTextContent('Likes: 7');
    expect(screen.getByTestId('stats-dislike')).toHaveTextContent('Dislikes: 3');
    expect(screen.getByTestId('comments')).toHaveTextContent('Great one, Bad one, Okay');
  });

  it('filters comments by sentiment', async () => {
    useFetchUserFeedback.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });
    render(<UserFeedbackPage />);
    const dropdownBtn = screen.getByRole('button', { name: /all user feedback/i });
    fireEvent.click(dropdownBtn);
    const positiveOption = screen.getByText(/positive only/i);
    fireEvent.click(positiveOption);
    await waitFor(() => {
      expect(screen.getByTestId('comments')).toHaveTextContent('Great one, Okay');
      expect(screen.getByTestId('comments')).not.toHaveTextContent('Bad day');
    });

    fireEvent.click(screen.getByRole('button', { name: /positive only/i }));
    fireEvent.click(screen.getByText(/negative only/i));
    await waitFor(() => {
      expect(screen.getByTestId('comments')).toHaveTextContent('Bad one');
      expect(screen.getByTestId('comments')).not.toHaveTextContent('Great one');
      expect(screen.getByTestId('comments')).not.toHaveTextContent('Okay');
    });
  });
});
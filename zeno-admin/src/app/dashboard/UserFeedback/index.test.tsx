import React from 'react';
import { render, screen } from '@testing-library/react';
import RecentFeedbackCard from '.';

jest.mock('../../hooks/useFetchUserReviews', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useFetchUserReviews from '../../hooks/useFetchUserReviews';

describe('RecentFeedbackCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useFetchUserReviews as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<RecentFeedbackCard />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useFetchUserReviews as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to fetch reviews',
    });

    render(<RecentFeedbackCard />);
    expect(screen.getByText(/Failed to fetch reviews/i)).toBeInTheDocument();
  });

  it('renders no feedback if there are no comments', () => {
    (useFetchUserReviews as jest.Mock).mockReturnValue({
      data: { comments: [] },
      loading: false,
      error: null,
    });

    render(<RecentFeedbackCard />);
    expect(screen.getByText(/User Feedback/i)).toBeInTheDocument();
    expect(screen.getByText(/Latest comments from users/i)).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('renders up to 3 most recent comments, sorted by date descending, with sentiment and author', () => {
    const mockComments = [
      {
        id: 1,
        comment: 'This is a great product!',
        sentiment: 'Positive',
        name: 'Arsema',
        date: '2025-09-23T16:00:00Z',
      },
      {
        id: 2,
        comment: 'Not happy with the experience',
        sentiment: 'Negative',
        name: 'Semhal',
        date: '2025-09-22T12:00:00Z',
      },
      {
        id: 3,
        comment: 'It does what I need.',
        sentiment: 'Positive',
        name: 'Selam',
        date: '2025-09-22T14:00:00Z',
      },
      {
        id: 4,
        comment: 'Okay, but could be better.',
        sentiment: 'Negative',
        name: null,
        date: '2025-09-21T15:00:00Z',
      },
    ];
    (useFetchUserReviews as jest.Mock).mockReturnValue({
      data: { comments: mockComments },
      loading: false,
      error: null,
    });

    render(<RecentFeedbackCard />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
    expect(items[0]).toHaveTextContent('This is a great product!');
    expect(items[1]).toHaveTextContent('It does what I need.');
    expect(items[2]).toHaveTextContent('Not happy with the experience');
    expect(screen.getAllByText(/Positive/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Negative/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/From Arsema/i)).toBeInTheDocument();
    expect(screen.getByText(/From Selam/i)).toBeInTheDocument();
    expect(screen.getByText(/From Semhal/i)).toBeInTheDocument();
  });

  it('truncates long comments to 35 characters and appends "....."', () => {
    const longComment = 'It was a good eperience, I wish to get more features for economists ut so far, you are goint AWESOME, THANK YOU Zen'; 
    const truncatedComment = longComment.slice(0, 35);
    (useFetchUserReviews as jest.Mock).mockReturnValue({
      data: {
        comments: [
          {
            id: 1,
            comment: longComment,
            sentiment: 'Positive',
            name: '',
            date: '2025-09-23T16:00:00Z',
          }
        ]
      },
      loading: false,
      error: null,
    });

    render(<RecentFeedbackCard />);
    expect(screen.getByText(new RegExp(`^“${truncatedComment}\\.+”$`))).toBeInTheDocument();
  });
});

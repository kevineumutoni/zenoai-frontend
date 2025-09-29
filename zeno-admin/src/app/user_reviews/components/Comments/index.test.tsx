import React from 'react';
import { render, screen } from '@testing-library/react';
import Comments from '.';
import { ReviewItem } from '../../../hooks/useFetchUserReviews';

function MockCommentItem(props: { comment: string }) {
  return <div data-testid="comment-item">{props.comment}</div>;
}
MockCommentItem.displayName = "MockCommentItem";

jest.mock('../CommentItem', () => ({
  __esModule: true,
  default: MockCommentItem,
}));

const commentsMock: ReviewItem[] = [
  {
    id: 1,
    name: 'arsema',
    email: 'arsema@gmail.com',
    comment: 'First',
    date: '2025-sep-1',
    sentiment: 'Positive',
    avatar: 'avatar.jpg',
  },
  {
    id: 2,
    name: 'helen',
    email: 'helen@gmail.com',
    comment: 'Second',
    date: '2025-sep-18',
    sentiment: 'Negative',
    avatar: 'avatar.jpg',
  },
];

describe('Comments', () => {
  it('displays "No comments yet" when comments array is empty', () => {
    render(<Comments comments={[]} />);
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
  });

  it('renders CommentItem for each comment', () => {
    render(<Comments comments={commentsMock} />);
    const renderedComments = screen.getAllByTestId('comment-item');
    expect(renderedComments).toHaveLength(commentsMock.length);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
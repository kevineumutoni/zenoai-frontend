import React from 'react';
import { render, screen } from '@testing-library/react';
import CommentItem from '.';

describe('CommentItem', () => {
  const props = {
    id: 1,
    name: 'arsema',
    email: 'arsema@example.com',
    comment: 'Great Platform you have.',
    date: 'Sep 1, 2025',
    sentiment: 'Positive' as const,
    avatar: 'avatar.jpg',
  };

  test('renders the comment item with correct data', () => {
    render(<CommentItem {...props} />);
    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText(props.email)).toBeInTheDocument();
    expect(screen.getByText(`“${props.comment}”`)).toBeInTheDocument();
    expect(screen.getByText(props.date)).toBeInTheDocument();
    expect(screen.getByText(props.sentiment)).toBeInTheDocument();
    const avatarImg = screen.getByAltText(props.name) as HTMLImageElement;
    expect(avatarImg).toHaveAttribute('src', props.avatar);
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import CommentItem from './index';

const mockProps = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane@example.com',
  comment: 'Great product!',
  date: '2025-09-28',
  sentiment: 'Positive' as const,
  avatar: '/avatar.jpg',
};

describe('CommentItem', () => {
  it('renders all comment fields correctly', () => {
    render(<CommentItem {...mockProps} />);
    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
    expect(screen.getByText(mockProps.email)).toBeInTheDocument();
    expect(screen.getByText(mockProps.date)).toBeInTheDocument();
    expect(screen.getByText(`“${mockProps.comment}”`)).toBeInTheDocument();
    expect(screen.getByText(mockProps.sentiment)).toBeInTheDocument();
  });

  it('renders avatar image with correct src and alt', () => {
    render(<CommentItem {...mockProps} />);
    const img = screen.getByAltText(mockProps.name) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(decodeURIComponent(img.src)).toContain(mockProps.avatar);
  });

  it('renders Positive sentiment with correct color', () => {
    render(<CommentItem {...mockProps} />);
    const sentiment = screen.getByText('Positive');
    expect(sentiment).toHaveClass('bg-green-600');
  });

  it('renders Negative sentiment with correct color', () => {
    render(<CommentItem {...mockProps} sentiment="Negative" />);
    const sentiment = screen.getByText('Negative');
    expect(sentiment).toHaveClass('bg-red-600');
  });
});
import { render, screen, waitFor } from '@testing-library/react';
import useFetchReviews, { Review } from './useFetchReviews';
import * as fetchModule from '../utils/fetchReviews';

function TestComponent() {
  const { reviews, loading, error } = useFetchReviews();
  return (
    <div>
      <span data-testid="loading">{loading ? 'true' : 'false'}</span>
      <span data-testid="reviews">{JSON.stringify(reviews)}</span>
      <span data-testid="error">{error ?? ''}</span>
    </div>
  );
}

describe('useFetchReviews', () => {
  const mockReviews: Review[] = [
    {
      review_id: 1,
      review_text: 'Great Experience with Zeno',
      rating: 1,
      created_at: '2025-09-18',
      user: 1,
    },
  ];

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('starts loading true and empty reviews', async () => {
    render(<TestComponent />);
    expect(screen.getByTestId('loading').textContent).toBe('true');
    expect(screen.getByTestId('reviews').textContent).toBe('[]');
    expect(screen.getByTestId('error').textContent).toBe('');
    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false')
    );
  });

  it('should fetch and set reviews when it is successful', async () => {
    jest.spyOn(fetchModule, 'fetchReviews').mockResolvedValueOnce(mockReviews);
    render(<TestComponent />);
    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false')
    );
    expect(screen.getByTestId('reviews').textContent).toBe(JSON.stringify(mockReviews));
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('should set error on fetch failure', async () => {
    const errorMessage = 'Fetch failed';
    jest.spyOn(fetchModule, 'fetchReviews').mockRejectedValueOnce(new Error(errorMessage));
    render(<TestComponent />);
    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false')
    );
    expect(screen.getByTestId('reviews').textContent).toBe('[]');
    expect(screen.getByTestId('error').textContent).toBe(errorMessage);
  });
});



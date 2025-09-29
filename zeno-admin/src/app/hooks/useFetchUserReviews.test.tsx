import { render, screen, waitFor } from '@testing-library/react';
import useFetchReviews, { Review } from './useFetchReviews';
import * as fetchReviewsModule from '../utils/fetchReviews';

function TestReviewsComponent() {
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
      review_text: 'Good one',
      rating: 1,
      created_at: '2025-09-18',
      user: 1,
    },
  ];
  const emptyReviews: Review[] = []

  afterEach(() => jest.restoreAllMocks());

  it('starts loading and empty', async () => {
    render(<TestReviewsComponent />);
    expect(screen.getByTestId('loading').textContent).toBe('true');
    expect(screen.getByTestId('reviews').textContent).toBe('[]');
    expect(screen.getByTestId('error').textContent).toBe('');
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
  });

  it('fetch and sets reviews', async () => {
    jest.spyOn(fetchReviewsModule, 'fetchReviews').mockResolvedValueOnce(mockReviews);
    render(<TestReviewsComponent />);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('reviews').textContent).toBe(JSON.stringify(mockReviews));
    expect(screen.getByTestId('error').textContent).toBe('');
  });


  it('sets error on failure', async () => {
    const errorMessage = 'Fetch failed';
    jest.spyOn(fetchReviewsModule, 'fetchReviews').mockRejectedValueOnce(new Error(errorMessage));
    render(<TestReviewsComponent />);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('reviews').textContent).toBe('[]');
    expect(screen.getByTestId('error').textContent).toBe(errorMessage);
  });

  it('fetch empty reviews', async () => {
    jest.spyOn(fetchReviewsModule, 'fetchReviews').mockResolvedValueOnce(emptyReviews);
    render(<TestReviewsComponent />);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('reviews').textContent).toBe(JSON.stringify([]));
    expect(screen.getByTestId('error').textContent).toBe('');
  });
});

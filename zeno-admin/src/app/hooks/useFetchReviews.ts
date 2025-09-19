import { useEffect, useState } from 'react';
import { fetchReviews } from '../utils/fetchReviews';

export interface Review {
  review_id: number;
  review_text: string;
  rating: number;
  created_at: string;
  user: number;
}

const useFetchReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReviews();
        setReviews(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { reviews, loading, error };
};

export default useFetchReviews;
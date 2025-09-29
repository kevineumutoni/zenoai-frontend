import { useEffect, useState, useMemo } from 'react';
import useFetchReviews from './useFetchReviews';
import useFetchUsers from './useFetchUsersById';


export interface ReviewItem {
  id: number;
  name: string;
  email: string;
  comment: string;
  date: string;
  sentiment: 'Positive' | 'Negative';
  avatar: string;
}


export interface ReviewData {
  totalReview: number;
  likes: number;
  dislikes: number;
  comments: ReviewItem[];
}


const useFetchUserReviews = () => {
  const { reviews, loading: reviewsLoading, error: reviewsError } = useFetchReviews();
  const userIds: number[] = useMemo(() => {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return [];
    }
    return [...new Set(reviews.map((review) => review.user))];
  }, [reviews]);


  const { users, loading: usersLoading, error: usersError } = useFetchUsers(userIds);


  const loading = reviewsLoading || usersLoading;
  const error = reviewsError || usersError;


  const [data, setData] = useState<ReviewData | null>(null);


  useEffect(() => {
    if (loading || error) {
      setData(null);
      return;
    }
    if (!Array.isArray(reviews) || !Array.isArray(users)) {
      setData(null);
      return;
    }
    const userMap = new Map(users.map((user) => [user.id, user]));
    const sortedReviews = reviews.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const comments: ReviewItem[] = sortedReviews.map((review) => {
      const user = userMap.get(review.user);
      return {
        id: review.review_id,
        name: user? `${capitalize(user.first_name)} ${capitalize(user.last_name)}`.trim(): `User #${review.user}`,
        email: user ? user.email : `user${review.user}@example.com`,
        comment: review.review_text,
        date: new Date(review.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        sentiment: review.rating === 1 ? 'Positive' : 'Negative',
        avatar:
          user && user.image
            ? `/media/${user.image}`
            : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      };
    });


    const likes = comments.filter((comment) => comment.sentiment === 'Positive').length;
    const dislikes = comments.filter((comment) => comment.sentiment === 'Negative').length;


    setData({
      totalReview: comments.length,
      likes,
      dislikes,
      comments,
    });
  }, [reviews, users, loading, error, userIds]);


  return { data, loading, error };
};

function capitalize(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
export default useFetchUserReviews;




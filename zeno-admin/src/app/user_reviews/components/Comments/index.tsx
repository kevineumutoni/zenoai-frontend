import React from 'react';
import CommentItem from '../CommentItem';;
import { ReviewItem } from '../../../hooks/useFetchUserReviews';

interface CommentsProps {
  comments: ReviewItem[];
}

const Comments = ({ comments }: CommentsProps) => (
  <div className="space-y-3 xl:max-h-[500px] 2xl:max-h-[600px] lg:max-h-[350px] overflow-y-auto border border-gray-700 py-2 px-4 md:px-6 lg:px-3 lg:py-2 transition-all">
    {comments.length === 0 ? (
      <div className="py-8 text-center text-gray-500 text-sm">No comments yet</div>
    ) : (
      comments.map((comment) => <CommentItem key={comment.id} {...comment} />)
    )}
  </div>
);

export default Comments;
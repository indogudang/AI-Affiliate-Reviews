
import React from 'react';
import { Review } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { UserIcon } from './icons/UserIcon';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to write one or generate an AI review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div key={review.id} className={`p-5 rounded-lg ${review.isAI ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-gray-800 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`p-1.5 rounded-full ${review.isAI ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                {review.isAI ? <SparklesIcon /> : <UserIcon />}
              </span>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{review.author}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;

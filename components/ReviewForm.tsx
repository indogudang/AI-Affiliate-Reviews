import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Button from './Button';

interface ReviewFormProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isLoading }) => {
  const [content, setContent] = useState('');
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.user) {
    // This form is only shown to logged-in users, so this is a fallback.
    return null;
  }
  const { user } = authContext;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-2">Write your review</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What do you think, ${user.email}?`}
          className="w-full h-24 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <div className="text-right mt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;

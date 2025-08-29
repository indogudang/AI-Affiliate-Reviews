
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Button from './Button';

interface ReviewFormProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isLoading }) => {
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);

  if (!authContext) return null;
  const { user, signIn, isLoading: isAuthLoading } = authContext;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email, password).catch(err => alert(err.message));
  };

  if (!user) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-2">Join the conversation</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Log in to share your thoughts. (Use any email and `password123` to test)</p>
        <form onSubmit={handleLogin} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-grow px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="flex-grow px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <Button type="submit" disabled={isAuthLoading}>
            {isAuthLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    );
  }

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

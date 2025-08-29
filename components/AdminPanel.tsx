
import React, { useState, useContext } from 'react';
import { supabase } from '../services/supabaseService';
import { AuthContext } from '../contexts/AuthContext';
import Button from './Button';
import { SparklesIcon } from './icons/SparklesIcon';

interface AdminPanelProps {
    onProductsGenerated: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onProductsGenerated }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a product topic.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await supabase.invokeCreateProductsFromAi(topic);
      setSuccessMessage(result.message || 'Products generated successfully!');
      setTopic('');
      onProductsGenerated(); // Refresh the product list on the home page
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400">You must be logged in to access the Admin Panel.</p>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Admin Panel</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Generate new affiliate products using AI.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Topic or Category
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., 'coffee brewing equipment' or 'running shoes for beginners'"
                className="w-full px-4 py-2 text-gray-900 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              <SparklesIcon />
              {isLoading ? 'Generating Products...' : 'Generate with AI'}
            </Button>
          </div>
        </form>

        {error && (
            <div className="mt-4 text-center p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
                {error}
            </div>
        )}
        {successMessage && (
            <div className="mt-4 text-center p-3 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-300 rounded-md">
                {successMessage}
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Button from './Button';

type AuthMode = 'signIn' | 'signUp';

const Login: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Loading...</div>; // Should not happen
  }
  const { signIn, signUp, isLoading } = authContext;

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'signIn') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'signIn' ? 'signUp' : 'signIn'));
    setError(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {mode === 'signIn' ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            {mode === 'signIn' 
              ? 'Sign in to continue to your account.' 
              : 'Get started by creating a new account.'}
          </p>

          <form onSubmit={handleAuthAction} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Processing...' : (mode === 'signIn' ? 'Sign In' : 'Sign Up')}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={toggleMode} className="font-medium text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              {mode === 'signIn' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

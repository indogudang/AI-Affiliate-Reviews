
import React, { useContext } from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { AuthContext } from '../contexts/AuthContext';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null; // or a loading state
  }
  const { user, signOut, isLoading } = authContext;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Affiliate Reviews
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <div className="text-sm">
              {isLoading ? (
                 <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600 dark:text-gray-300 hidden sm:inline">{user.email}</span>
                  <button
                    onClick={signOut}
                    className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Guest</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


import React, { useContext } from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { AuthContext } from '../contexts/AuthContext';
import Button from './Button';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate: (page: 'home' | 'login' | 'admin') => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode, searchQuery, onSearchChange, onNavigate }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null; 
  }
  const { user, signOut, isLoading } = authContext;

  const handleLogoClick = () => {
    onNavigate('home');
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1
              onClick={handleLogoClick}
              className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer"
              aria-label="Back to homepage"
            >
              AI Affiliate Reviews
            </h1>
          </div>

          <div className="flex-grow flex items-center justify-center px-4 sm:px-8">
            <div className="w-full max-w-md">
              <input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2 text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                aria-label="Search products"
              />
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            
            {user && (
                 <button onClick={() => onNavigate('admin')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500">
                    Admin Panel
                 </button>
            )}

            <div className="text-sm">
              {isLoading ? (
                 <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : user ? (
                <Button
                    onClick={async () => {
                        await signOut();
                    }}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  >
                    Logout
                </Button>
              ) : (
                <Button onClick={() => onNavigate('login')}>
                    Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

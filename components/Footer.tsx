
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} AI Affiliate Reviews. All rights reserved.</p>
        <p className="text-xs mt-1">Powered by React, Tailwind CSS, and Gemini AI.</p>
      </div>
    </footer>
  );
};

export default Footer;

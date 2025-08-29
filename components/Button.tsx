
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900 transition-colors duration-200";
  const enabledClasses = "bg-indigo-600 hover:bg-indigo-700";
  const disabledClasses = "bg-indigo-400 dark:bg-indigo-800 cursor-not-allowed";

  const finalClassName = `${baseClasses} ${props.disabled ? disabledClasses : enabledClasses} ${className}`;

  return (
    <button className={finalClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;

import React from 'react';
import { Button as BaseButton } from './button';

// Typography component
interface TypographyProps {
  variant?: 'heading' | 'subheading' | 'body' | 'caption';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  size = 'md', 
  weight = 'normal', 
  className = '', 
  children 
}) => {
  const baseClasses = 'text-gray-900';
  const variantClasses = {
    heading: 'font-bold',
    subheading: 'font-semibold',
    body: 'font-normal',
    caption: 'font-normal text-gray-600'
  };
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${weightClasses[weight]} ${className}`;

  return <div className={classes}>{children}</div>;
};

// EnhancedCard component
interface EnhancedCardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({ 
  variant = 'default', 
  hover = false,
  className = '', 
  onClick,
  children
}) => {
  const baseClasses = 'rounded-lg p-4';
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md border border-gray-100',
    outlined: 'bg-transparent border-2 border-gray-300'
  };
  
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  return <div className={classes} onClick={onClick}>{children}</div>;
};

// Button Component
interface ButtonProps {
  variant?: 'primary' | 'filled' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  onClick,
  children,
  disabled = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    filled: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
    ghost: 'hover:bg-gray-100 hover:text-gray-900'
  };
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-8 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center space-x-2">
        <div className={`${sizeClasses[size]} bg-primary rounded-full animate-bounce`}></div>
        <div className={`${sizeClasses[size]} bg-primary rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
        <div className={`${sizeClasses[size]} bg-primary rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-muted border-t-primary`}></div>
  );
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-muted rounded-lg ${className}`}></div>
  );
}; 
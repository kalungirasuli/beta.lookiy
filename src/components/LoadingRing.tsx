'use client';

import React from 'react';

interface LoadingRingProps {
  progress: number; // 0-100 percentage
  size?: number; // Size of the ring in pixels
  strokeWidth?: number; // Width of the ring stroke
  children?: React.ReactNode; // Content to display inside the ring
  className?: string;
}

const LoadingRing: React.FC<LoadingRingProps> = ({
  progress,
  size = 40,
  strokeWidth = 3,
  children,
  className = ''
}) => {
  // Calculate the circumference and stroke dash array for the progress ring
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background ring */}
      <svg
        className="absolute inset-0 transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-300"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-orange-500 transition-all duration-300 ease-out"
        />
      </svg>
      
      {/* Children content in the center */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default LoadingRing;
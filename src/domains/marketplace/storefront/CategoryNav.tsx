import React from 'react';

export const CategoryNav: React.FC = () => {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto py-4">
          <a href="#" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">All Categories</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">Electronics</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">Fashion</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">Home & Garden</a>
        </div>
      </div>
    </nav>
  );
};

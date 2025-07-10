"use client";

import React, { useState, useEffect } from 'react';

interface SearchSuggestion {
  id: string;
  query: string;
  type: 'product' | 'category' | 'brand' | 'trending';
  icon?: string;
  count?: number;
}

interface AISearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  onClose?: () => void;
  className?: string;
  maxSuggestions?: number;
}

const AISearchSuggestions: React.FC<AISearchSuggestionsProps> = ({
  query,
  onSuggestionClick,
  onClose,
  className = "",
  maxSuggestions = 8
}) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock AI-powered suggestions
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', query: 'construction materials', type: 'category', icon: '🏗️', count: 450 },
    { id: '2', query: 'safety equipment', type: 'category', icon: '🦺', count: 230 },
    { id: '3', query: 'power tools', type: 'category', icon: '🔧', count: 180 },
    { id: '4', query: 'cement bags', type: 'product', icon: '🏗️', count: 89 },
    { id: '5', query: 'steel rebar', type: 'product', icon: '⚙️', count: 125 },
    { id: '6', query: 'safety helmets', type: 'trending', icon: '🚨', count: 67 },
    { id: '7', query: 'drill bits', type: 'product', icon: '🔩', count: 45 },
    { id: '8', query: 'measuring tools', type: 'category', icon: '📏', count: 78 },
    { id: '9', query: 'concrete mixer', type: 'product', icon: '🚚', count: 23 },
    { id: '10', query: 'electrical supplies', type: 'category', icon: '⚡', count: 156 }
  ];

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    // Simulate AI processing delay
    const timer = setTimeout(() => {
      const filtered = mockSuggestions
        .filter(suggestion => 
          suggestion.query.toLowerCase().includes(query.toLowerCase()) ||
          query.toLowerCase().includes(suggestion.query.toLowerCase())
        )
        .slice(0, maxSuggestions);
      
      setSuggestions(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, maxSuggestions]);

  const getTypeIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product': return '📦';
      case 'category': return '📂';
      case 'brand': return '🏷️';
      case 'trending': return '🔥';
      default: return '🔍';
    }
  };

  const getTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product': return 'Product';
      case 'category': return 'Category';
      case 'brand': return 'Brand';
      case 'trending': return 'Trending';
      default: return 'Search';
    }
  };

  const getTypeColor = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product': return 'text-blue-600 bg-blue-100';
      case 'category': return 'text-green-600 bg-green-100';
      case 'brand': return 'text-purple-600 bg-purple-100';
      case 'trending': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!query || query.length < 2) {
    return null;
  }

  return (
    <div className={`absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 ${className}`}>
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">AI is analyzing your search...</span>
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          <>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-600">AI SUGGESTIONS</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Smart Search
                </span>
              </div>
            </div>
            
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{suggestion.icon || getTypeIcon(suggestion.type)}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{suggestion.query}</span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(suggestion.type)}`}>
                            {getTypeLabel(suggestion.type)}
                          </span>
                        </div>
                        {suggestion.count && (
                          <p className="text-sm text-gray-500">{suggestion.count} items</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {suggestion.type === 'trending' && (
                        <span className="text-xs text-red-500 font-medium">TRENDING</span>
                      )}
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                💡 Suggestions powered by AI based on your search and trending items
              </p>
            </div>
          </>
        ) : (
          <div className="p-4 text-center">
            <div className="text-gray-400 text-lg mb-2">🔍</div>
            <p className="text-sm text-gray-600">No suggestions found for "{query}"</p>
            <p className="text-xs text-gray-500 mt-1">Try different keywords or check spelling</p>
          </div>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AISearchSuggestions;

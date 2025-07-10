import React from 'react';
import { Header } from '../../../shared/components/ui/Header';
import { Footer } from '../../../shared/components/ui/Footer';
import { SearchBar } from '../search/SearchBar';
import { CategoryNav } from './CategoryNav';

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

/**
 * Amazon.sa-style storefront layout
 * Unified interface for browsing all stores
 */
export const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4 text-center">
            اكتشف آلاف المتاجر في مكان واحد
          </h1>
          <p className="text-center mb-6 text-blue-100">
            تسوق من أفضل المتاجر السعودية - أسعار منافسة وجودة عالية
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Category Navigation */}
      <CategoryNav />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default StorefrontLayout;

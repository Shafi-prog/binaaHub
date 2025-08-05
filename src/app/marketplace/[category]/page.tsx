import React from 'react';
import { MarketplaceLayout } from '../../../components/marketplace/MarketplaceLayout';
import { useRouter } from 'next/navigation';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const router = useRouter();
  const { category } = params;

  const handleAddToProject = (productId: string) => {
    console.log('Adding product to project:', productId);
    // TODO: Implement project selection modal or redirect
  };

  const handleViewStore = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/marketplace/product/${productId}`);
  };

  // TODO: Pass category filter to MarketplaceLayout
  return (
    <MarketplaceLayout
      onAddToProject={handleAddToProject}
      onViewStore={handleViewStore}
      onViewProduct={handleViewProduct}
      showAddToProject={true}
      projectContext={false}
    />
  );
}

export async function generateStaticParams() {
  const categories = [
    'building-materials',
    'fixtures',
    'furniture',
    'appliances',
    'lighting',
    'flooring',
    'painting',
  ];

  return categories.map((category) => ({
    category,
  }));
}

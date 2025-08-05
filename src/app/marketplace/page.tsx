import React from 'react';
import { MarketplaceLayout } from '../../domains/marketplace/components/MarketplaceLayout';
import { useRouter } from 'next/navigation';

export default function MarketplacePage() {
  const router = useRouter();

  const handleAddToProject = (productId: string) => {
    // For standalone marketplace, redirect to project selection or login
    console.log('Adding product to project:', productId);
    // TODO: Implement project selection modal or redirect to login/project page
  };

  const handleViewStore = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/marketplace/product/${productId}`);
  };

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

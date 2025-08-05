import { MarketplaceProvider } from '@/components/marketplace/MarketplaceProvider';
import { MarketplaceView } from '@/components/marketplace/MarketplaceView';

export default function PublicMarketplacePage() {
  return (
    <MarketplaceProvider>
      <MarketplaceView />
    </MarketplaceProvider>
  );
}



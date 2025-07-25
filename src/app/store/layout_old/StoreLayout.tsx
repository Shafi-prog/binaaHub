// @ts-nocheck
import React from 'react';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="store-layout">
      {/* Store dashboard navigation, Medusa features, etc. */}
      {children}
    </div>
  );
}



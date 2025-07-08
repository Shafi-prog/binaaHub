// @ts-nocheck
import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

export function ButtonLoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-5 h-5 border-t-2 border-blue-200 rounded-full animate-spin"></div>
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center relative min-w-[250px]">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Loading...</p>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full text-center text-xs text-gray-400 font-semibold tracking-wide">
          MADE WITH LOVE شافي
        </div>
      </div>
    </div>
  );
}



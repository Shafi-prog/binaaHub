import React from 'react';
import LoadingSpinner from './src/components/ui/Loading';

// Simple test component to verify Loading component works
const TestLoadingComponent: React.FC = () => {
  return (
    <div style={{ width: '400px', height: '300px', border: '1px solid #ccc' }}>
      <h2>Testing Loading Component:</h2>
      <LoadingSpinner />
    </div>
  );
};

export default TestLoadingComponent;

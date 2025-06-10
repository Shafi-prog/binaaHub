// Test file to check project loading error in browser
console.log('🔍 Testing project loading...');

// Check if we're in browser environment
if (typeof window !== 'undefined') {
  
  // First check if the project ID exists
  const projectId = 'd85a1908-ab4e-4ea0-9892-9493cdd52e27';
  console.log('📋 Testing project ID:', projectId);
  
  // Check current URL
  console.log('🌐 Current URL:', window.location.href);
  
  // Check if there are any console errors
  const originalError = console.error;
  console.error = function(...args) {
    originalError.apply(console, ['🚨 Console Error:', ...args]);
  };
  
  // Check if we can access local storage or session storage
  try {
    const hasStorage = !!localStorage;
    console.log('💾 Local storage available:', hasStorage);
  } catch (e) {
    console.log('❌ Local storage error:', e.message);
  }
  
  // Check for Supabase
  setTimeout(() => {
    if (window.supabase || window._supabase) {
      console.log('✅ Supabase client detected');
    } else {
      console.log('❌ No Supabase client found in window');
    }
  }, 2000);
  
} else {
  console.log('🖥️ Running in Node.js environment');
}

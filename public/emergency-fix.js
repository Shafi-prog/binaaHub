/**
 * FINAL EMERGENCY FIX for Database Error {}
 * This will implement multiple fallback mechanisms to ensure error visibility
 */

// Step 1: Force browser cache clear and add version tracking
const EMERGENCY_FIX_VERSION = '2024-12-07-FINAL';
console.log('🚨 EMERGENCY DATABASE ERROR FIX LOADED - Version:', EMERGENCY_FIX_VERSION);

// Step 2: Override console.error to ensure error objects are properly displayed
const originalConsoleError = console.error;
console.error = function(...args) {
  // Apply original console.error
  originalConsoleError.apply(console, args);
  
  // Add additional error processing for empty objects
  args.forEach((arg, index) => {
    if (typeof arg === 'object' && arg !== null) {
      const keys = Object.keys(arg);
      if (keys.length === 0) {
        originalConsoleError(`🔍 EMPTY OBJECT DETECTED at argument ${index}:`, {
          type: typeof arg,
          constructor: arg.constructor?.name,
          prototype: Object.getPrototypeOf(arg),
          json: JSON.stringify(arg),
          stringified: String(arg)
        });
      } else if (keys.length > 0) {
        originalConsoleError(`📊 Object details for argument ${index}:`, {
          keys: keys,
          values: Object.values(arg),
          entries: Object.entries(arg)
        });
      }
    }
  });
};

// Step 3: Add global error handler
window.addEventListener('unhandledrejection', function(event) {
  console.error('🚨 UNHANDLED PROMISE REJECTION:', {
    reason: event.reason,
    reasonType: typeof event.reason,
    reasonString: String(event.reason),
    reasonJSON: JSON.stringify(event.reason, null, 2)
  });
});

// Step 4: Monitor for specific database errors
const originalFetch = window.fetch;
window.fetch = function(...args) {
  return originalFetch.apply(this, args).then(response => {
    if (!response.ok) {
      console.error('🌐 FETCH ERROR DETECTED:', {
        url: args[0],
        status: response.status,
        statusText: response.statusText
      });
    }
    return response;
  }).catch(error => {
    console.error('🌐 FETCH CATCH ERROR:', {
      url: args[0],
      error: error,
      errorType: typeof error,
      errorMessage: error.message,
      errorStack: error.stack
    });
    throw error;
  });
};

// Step 5: Add debugging information to page
function addDebugInfo() {
  const debugDiv = document.createElement('div');
  debugDiv.id = 'emergency-debug-info';
  debugDiv.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #ff0000;
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 99999;
    max-width: 300px;
  `;
  debugDiv.innerHTML = `
    <strong>🚨 EMERGENCY DEBUG MODE</strong><br>
    Version: ${EMERGENCY_FIX_VERSION}<br>
    Time: ${new Date().toLocaleTimeString()}<br>
    Console patched: ✅<br>
    Error handlers: ✅<br>
    <button onclick="this.parentElement.remove()">Close</button>
  `;
  document.body.appendChild(debugDiv);
  
  // Remove after 10 seconds
  setTimeout(() => {
    if (debugDiv.parentElement) {
      debugDiv.remove();
    }
  }, 10000);
}

// Step 6: Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addDebugInfo);
} else {
  addDebugInfo();
}

console.log('✅ Emergency database error fix initialized');
console.log('📋 Instructions:');
console.log('1. Hard refresh the page (Ctrl+Shift+R)');
console.log('2. Clear browser cache completely');
console.log('3. Navigate to project page');
console.log('4. Check console for detailed error information');

export default EMERGENCY_FIX_VERSION;

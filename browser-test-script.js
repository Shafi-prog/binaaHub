// Test script to run in browser console
// Go to http://localhost:3000/login and paste this in the browser console

async function testLoginFlow() {
  console.log('🧪 Starting comprehensive login test...')
  
  // Check if we're on the login page
  if (!window.location.pathname.includes('/login')) {
    console.log('❌ Navigate to /login first')
    return
  }
  
  try {
    // Fill the form
    const emailInput = document.querySelector('input[type="email"]')
    const passwordInput = document.querySelector('input[type="password"]')
    const submitButton = document.querySelector('button[type="submit"]')
    
    if (!emailInput || !passwordInput || !submitButton) {
      console.log('❌ Form elements not found')
      return
    }
    
    emailInput.value = 'user@user.com'
    passwordInput.value = '123456'
    
    console.log('✅ Form filled with test credentials')
    
    // Simulate form submission
    console.log('🚀 Submitting form...')
    submitButton.click()
    
    console.log('✅ Form submitted. Watch the console for login logs...')
    
  } catch (error) {
    console.error('❌ Test error:', error)
  }
}

// Run the test
testLoginFlow()

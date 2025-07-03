# 🔐 Login Credentials for Development

For testing the Binna platform, use these credentials:

## Store Owner Account
- **Email:** `store@store.com`
- **Password:** `store123`
- **Account Type:** Store
- **Redirects to:** `/store/dashboard`

## Available Login Pages
- Main Login: http://localhost:3000/login
- Debug Login: http://localhost:3000/login-debug

## Test the Login Flow

1. **Backend API Test** (already verified working):
   ```bash
   node test-login-flow.js
   ```

2. **Frontend Test**:
   - Visit http://localhost:3000/login-debug
   - Use the credentials above
   - Check browser console for detailed logs

## Common Issues & Solutions

### "Invalid email or password" Error
- **Cause**: Wrong credentials or API not responding
- **Solution**: Use exact credentials above, check if server is running

### JavaScript Console Errors
- **Cause**: Missing dependencies or browser compatibility
- **Solution**: Check browser console (F12) for specific errors

### Redirect Issues
- **Cause**: Dashboard pages not loading
- **Solution**: Verify `/store/dashboard` page exists and loads

## Verification Steps

1. ✅ Backend APIs working (verified with test-login-flow.js)
2. ❓ Frontend login form (test with login-debug page)
3. ❓ Browser console errors (check F12 developer tools)
4. ❓ Correct credentials (use store@store.com / store123)

## Next Steps

If login still fails:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try login and check for errors
4. Share any error messages for further debugging

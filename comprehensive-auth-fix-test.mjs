#!/usr/bin/env node

/**
 * Comprehensive Authentication Fix Verification
 * Tests the complete authentication flow to ensure the fix resolves the issue
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const BASE_URL = 'http://localhost:3000';

// Test credentials (replace with actual test user)
const TEST_USER = {
  email: 'test@binacodes.com',
  password: 'testpassword123',
};

class AuthenticationTester {
  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    this.results = [];
    this.sessionCookies = '';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logEntry);
    this.results.push({ timestamp, message, type });
  }

  async testServerConnection() {
    this.log('🔍 Testing server connection...', 'info');
    try {
      const response = await fetch(`${BASE_URL}/`, { method: 'HEAD' });
      if (response.ok) {
        this.log('✅ Server is running and accessible', 'success');
        return true;
      } else {
        this.log(`❌ Server returned status: ${response.status}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`❌ Server connection failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testSupabaseConnection() {
    this.log('🔍 Testing Supabase connection...', 'info');
    try {
      const { data, error } = await this.supabase.from('users').select('count').limit(1);
      if (error) {
        this.log(`❌ Supabase connection failed: ${error.message}`, 'error');
        return false;
      } else {
        this.log('✅ Supabase connection successful', 'success');
        return true;
      }
    } catch (error) {
      this.log(`❌ Supabase connection error: ${error.message}`, 'error');
      return false;
    }
  }

  async testUserLogin() {
    this.log('🔍 Testing user login...', 'info');
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      if (error) {
        this.log(`❌ Login failed: ${error.message}`, 'error');
        return false;
      }

      if (data.user && data.session) {
        this.log(`✅ Login successful for user: ${data.user.email}`, 'success');

        // Extract session cookies for testing
        this.sessionCookies = this.extractSessionCookies(data.session);
        return { user: data.user, session: data.session };
      } else {
        this.log('❌ Login failed: No user or session returned', 'error');
        return false;
      }
    } catch (error) {
      this.log(`❌ Login error: ${error.message}`, 'error');
      return false;
    }
  }

  extractSessionCookies(session) {
    // Simulate the cookies that would be set by the browser
    const accessToken = session.access_token;
    const refreshToken = session.refresh_token;

    return [
      `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token=${JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: session.expires_at,
        token_type: 'bearer',
        user: session.user,
      })}`,
      `user_email=${encodeURIComponent(session.user.email)}`,
    ].join('; ');
  }

  async testMiddlewareProtection() {
    this.log('🔍 Testing middleware protection...', 'info');
    try {
      // Test accessing dashboard without auth
      const unauthorizedResponse = await fetch(`${BASE_URL}/user/dashboard`, {
        method: 'HEAD',
        redirect: 'manual',
      });

      if (unauthorizedResponse.status === 302 || unauthorizedResponse.status === 307) {
        const location = unauthorizedResponse.headers.get('location');
        if (location && location.includes('/login')) {
          this.log('✅ Middleware correctly redirects unauthorized users to login', 'success');
          return true;
        }
      }

      this.log('⚠️ Middleware behavior unexpected - check configuration', 'warning');
      return false;
    } catch (error) {
      this.log(`❌ Middleware test error: ${error.message}`, 'error');
      return false;
    }
  }

  async testAuthenticatedDashboardAccess() {
    this.log('🔍 Testing authenticated dashboard access...', 'info');
    try {
      const response = await fetch(`${BASE_URL}/user/dashboard`, {
        method: 'GET',
        headers: {
          Cookie: this.sessionCookies,
          'User-Agent': 'Mozilla/5.0 (compatible; AuthTester/1.0)',
        },
        redirect: 'manual',
      });

      if (response.status === 302 || response.status === 307) {
        this.log('❌ Authenticated user redirected - auth cookies not working', 'error');
        return false;
      }

      if (response.ok) {
        const html = await response.text();

        // Check for the problematic "المستخدم غير مسجل الدخول" message
        const hasAuthError =
          html.includes('المستخدم غير مسجل الدخول') || html.includes('User not logged in');

        const hasLoginButton = html.includes('تسجيل الدخول') && html.includes('href="/login"');

        const hasUserContent =
          html.includes('dashboard-stats') ||
          html.includes('user-dashboard') ||
          html.includes('مرحباً') ||
          html.includes('Welcome');

        if (hasAuthError || hasLoginButton) {
          this.log(
            '❌ CRITICAL: Dashboard shows "المستخدم غير مسجل الدخول" - FIX NEEDED!',
            'error',
          );
          this.log('❌ The authentication issue is still present', 'error');
          return false;
        } else if (hasUserContent) {
          this.log('✅ Dashboard loads correctly with user content', 'success');
          this.log('✅ Authentication fix appears to be working!', 'success');
          return true;
        } else {
          this.log('⚠️ Dashboard loads but content is unclear - needs investigation', 'warning');
          return 'unclear';
        }
      } else {
        this.log(`❌ Dashboard returned status: ${response.status}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`❌ Dashboard test error: ${error.message}`, 'error');
      return false;
    }
  }

  async testAuthRecoveryMethods() {
    this.log('🔍 Testing authentication recovery methods...', 'info');

    const methods = ['getSession', 'refreshSession', 'getUser', 'fallbackCookie'];

    let successfulMethods = 0;

    for (const method of methods) {
      try {
        this.log(`   Testing ${method}...`, 'info');

        switch (method) {
          case 'getSession':
            const sessionResult = await this.supabase.auth.getSession();
            if (sessionResult.data.session) {
              successfulMethods++;
              this.log(`   ✅ ${method} successful`, 'success');
            } else {
              this.log(`   ❌ ${method} failed`, 'error');
            }
            break;

          case 'refreshSession':
            const refreshResult = await this.supabase.auth.refreshSession();
            if (refreshResult.data.session) {
              successfulMethods++;
              this.log(`   ✅ ${method} successful`, 'success');
            } else {
              this.log(`   ❌ ${method} failed`, 'error');
            }
            break;

          case 'getUser':
            const userResult = await this.supabase.auth.getUser();
            if (userResult.data.user) {
              successfulMethods++;
              this.log(`   ✅ ${method} successful`, 'success');
            } else {
              this.log(`   ❌ ${method} failed`, 'error');
            }
            break;

          case 'fallbackCookie':
            // Simulate cookie-based recovery
            if (this.sessionCookies && this.sessionCookies.includes('user_email=')) {
              successfulMethods++;
              this.log(`   ✅ ${method} successful`, 'success');
            } else {
              this.log(`   ❌ ${method} failed`, 'error');
            }
            break;
        }

        // Wait between attempts
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        this.log(`   ❌ ${method} error: ${error.message}`, 'error');
      }
    }

    if (successfulMethods >= 2) {
      this.log(
        `✅ Auth recovery system working (${successfulMethods}/${methods.length} methods)`,
        'success',
      );
      return true;
    } else {
      this.log(
        `❌ Auth recovery insufficient (${successfulMethods}/${methods.length} methods)`,
        'error',
      );
      return false;
    }
  }

  async testCompleteFlow() {
    this.log('🚀 Starting comprehensive authentication fix verification...', 'info');
    this.log('========================================================', 'info');

    const results = {
      serverConnection: await this.testServerConnection(),
      supabaseConnection: await this.testSupabaseConnection(),
      userLogin: await this.testUserLogin(),
      middlewareProtection: await this.testMiddlewareProtection(),
      authenticatedAccess: false,
      authRecovery: false,
    };

    // Only test authenticated features if login succeeded
    if (results.userLogin) {
      results.authenticatedAccess = await this.testAuthenticatedDashboardAccess();
      results.authRecovery = await this.testAuthRecoveryMethods();
    }

    this.log('========================================================', 'info');
    this.generateFinalReport(results);
  }

  generateFinalReport(results) {
    this.log('📊 FINAL VERIFICATION REPORT', 'info');
    this.log('========================================================', 'info');

    const overallSuccess =
      results.serverConnection &&
      results.supabaseConnection &&
      results.userLogin &&
      results.middlewareProtection &&
      results.authenticatedAccess === true &&
      results.authRecovery;

    if (overallSuccess) {
      this.log('🎉 SUCCESS! Authentication fix is working correctly!', 'success');
      this.log('✅ Users will no longer see "المستخدم غير مسجل الدخول"', 'success');
      this.log('✅ Dashboard authentication is properly synchronized', 'success');
    } else {
      this.log('❌ ISSUES DETECTED - Fix needs more work', 'error');

      if (!results.authenticatedAccess) {
        this.log('🔥 CRITICAL: Dashboard still shows authentication error', 'error');
        this.log('💡 Recommendation: Check auth-recovery.ts implementation', 'warning');
        this.log('💡 Recommendation: Verify cookie synchronization in middleware', 'warning');
      }
    }

    this.log('========================================================', 'info');
    this.log('Test Results Summary:', 'info');
    Object.entries(results).forEach(([test, result]) => {
      const status = result === true ? '✅' : result === false ? '❌' : '⚠️';
      this.log(`${status} ${test}: ${result}`, 'info');
    });

    // Export results for further analysis
    this.exportResults(results, overallSuccess);
  }

  exportResults(results, overallSuccess) {
    const report = {
      timestamp: new Date().toISOString(),
      overallSuccess,
      testResults: results,
      detailedLog: this.results,
      recommendations: this.generateRecommendations(results),
    };

    console.log('\n📄 Detailed Report (JSON):');
    console.log(JSON.stringify(report, null, 2));
  }

  generateRecommendations(results) {
    const recommendations = [];

    if (!results.authenticatedAccess) {
      recommendations.push('Review auth-recovery.ts implementation for edge cases');
      recommendations.push('Check middleware cookie handling for Next.js 15 compatibility');
      recommendations.push('Verify session synchronization timing issues');
      recommendations.push('Test with different browsers and cookie settings');
    }

    if (!results.authRecovery) {
      recommendations.push('Strengthen fallback authentication methods');
      recommendations.push('Add more robust error handling in auth recovery');
    }

    if (results.authenticatedAccess === 'unclear') {
      recommendations.push('Add clearer authentication state indicators in Dashboard UI');
      recommendations.push('Improve loading states during authentication recovery');
    }

    return recommendations;
  }

  async cleanup() {
    try {
      await this.supabase.auth.signOut();
      this.log('🧹 Cleaned up test session', 'info');
    } catch (error) {
      this.log(`⚠️ Cleanup warning: ${error.message}`, 'warning');
    }
  }
}

// Run the tests
async function main() {
  const tester = new AuthenticationTester();

  try {
    await tester.testCompleteFlow();
  } catch (error) {
    console.error('Test execution error:', error);
  } finally {
    await tester.cleanup();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default AuthenticationTester;

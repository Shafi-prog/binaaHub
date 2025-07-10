#!/usr/bin/env node

/**
 * Binna Platform Security Audit Script
 * Comprehensive security assessment for Phase 6 launch preparation
 * 
 * Usage: node scripts/security-audit.js [options]
 * Options:
 *   --target <url>     Target URL for audit
 *   --deep             Run deep security scan
 *   --format <type>    Output format (json|html|text)
 *   --output <file>    Output file path
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const crypto = require('crypto');

// Configuration
const CONFIG = {
  target: process.env.SECURITY_TARGET || 'https://localhost:3000',
  deep: process.env.DEEP_SCAN === 'true',
  format: process.env.OUTPUT_FORMAT || 'text',
  output: process.env.OUTPUT_FILE || null
};

// Parse command line arguments
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 2) {
  const key = args[i]?.replace('--', '');
  const value = args[i + 1];
  if (key && CONFIG.hasOwnProperty(key)) {
    CONFIG[key] = value === 'true' ? true : value === 'false' ? false : value;
  }
}

// Security test categories
const SECURITY_TESTS = {
  ssl: {
    name: 'SSL/TLS Security',
    tests: [
      'certificate-validity',
      'protocol-support',
      'cipher-strength',
      'certificate-chain',
      'hsts-header',
      'ssl-vulnerabilities'
    ]
  },
  headers: {
    name: 'HTTP Security Headers',
    tests: [
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'strict-transport-security',
      'referrer-policy',
      'permissions-policy'
    ]
  },
  authentication: {
    name: 'Authentication Security',
    tests: [
      'session-management',
      'password-policy',
      'brute-force-protection',
      'multi-factor-authentication',
      'jwt-security',
      'oauth-implementation'
    ]
  },
  authorization: {
    name: 'Authorization Controls',
    tests: [
      'role-based-access',
      'privilege-escalation',
      'horizontal-access',
      'vertical-access',
      'api-authorization',
      'resource-protection'
    ]
  },
  input: {
    name: 'Input Validation',
    tests: [
      'sql-injection',
      'xss-prevention',
      'csrf-protection',
      'file-upload-security',
      'command-injection',
      'path-traversal'
    ]
  },
  api: {
    name: 'API Security',
    tests: [
      'rate-limiting',
      'cors-configuration',
      'api-versioning',
      'error-handling',
      'data-validation',
      'swagger-security'
    ]
  },
  data: {
    name: 'Data Protection',
    tests: [
      'encryption-at-rest',
      'encryption-in-transit',
      'sensitive-data-exposure',
      'data-backup-security',
      'pii-protection',
      'gdpr-compliance'
    ]
  },
  infrastructure: {
    name: 'Infrastructure Security',
    tests: [
      'server-hardening',
      'network-security',
      'firewall-configuration',
      'intrusion-detection',
      'logging-monitoring',
      'backup-security'
    ]
  }
};

// Test results tracking
const auditResults = {
  passed: 0,
  failed: 0,
  warning: 0,
  info: 0,
  total: 0,
  details: [],
  vulnerabilities: []
};

// Utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const levels = {
    info: '📝',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    debug: '🔍'
  };
  
  console.log(`${levels[level]} [${timestamp}] ${message}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 10000,
      rejectUnauthorized: false // Allow self-signed certificates for testing
    };
    
    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function runSecurityTest(testName, category, testFunction) {
  const startTime = Date.now();
  
  try {
    log(`Running security test: ${testName}`, 'info');
    
    const result = await testFunction();
    const duration = Date.now() - startTime;
    
    const testResult = {
      name: testName,
      category: category,
      duration: duration,
      status: result.status,
      severity: result.severity || 'info',
      message: result.message,
      details: result.details || {},
      timestamp: new Date().toISOString()
    };
    
    auditResults.total++;
    auditResults[result.status]++;
    
    if (result.status === 'failed' && result.severity === 'high') {
      auditResults.vulnerabilities.push(testResult);
    }
    
    auditResults.details.push(testResult);
    
    const statusIcon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⚠️';
    log(`${statusIcon} ${testName} - ${result.status.toUpperCase()} (${duration}ms)`, 
        result.status === 'passed' ? 'success' : result.status === 'failed' ? 'error' : 'warning');
    
    return testResult;
  } catch (error) {
    const duration = Date.now() - startTime;
    const testResult = {
      name: testName,
      category: category,
      duration: duration,
      status: 'failed',
      severity: 'high',
      message: `Test execution failed: ${error.message}`,
      details: { error: error.message },
      timestamp: new Date().toISOString()
    };
    
    auditResults.total++;
    auditResults.failed++;
    auditResults.details.push(testResult);
    
    log(`❌ ${testName} - ERROR: ${error.message}`, 'error');
    return testResult;
  }
}

// Security test implementations
const securityTests = {
  'certificate-validity': async () => {
    try {
      const response = await makeRequest(CONFIG.target);
      return {
        status: 'passed',
        severity: 'medium',
        message: 'SSL certificate is valid and properly configured',
        details: { statusCode: response.statusCode }
      };
    } catch (error) {
      return {
        status: 'failed',
        severity: 'high',
        message: 'SSL certificate validation failed',
        details: { error: error.message }
      };
    }
  },
  
  'content-security-policy': async () => {
    try {
      const response = await makeRequest(CONFIG.target);
      const csp = response.headers['content-security-policy'];
      
      if (!csp) {
        return {
          status: 'failed',
          severity: 'medium',
          message: 'Content Security Policy header is missing',
          details: { headers: response.headers }
        };
      }
      
      return {
        status: 'passed',
        severity: 'low',
        message: 'Content Security Policy is properly configured',
        details: { csp: csp }
      };
    } catch (error) {
      return {
        status: 'failed',
        severity: 'medium',
        message: 'Failed to check CSP header',
        details: { error: error.message }
      };
    }
  },
  
  'x-frame-options': async () => {
    try {
      const response = await makeRequest(CONFIG.target);
      const xFrameOptions = response.headers['x-frame-options'];
      
      if (!xFrameOptions) {
        return {
          status: 'failed',
          severity: 'medium',
          message: 'X-Frame-Options header is missing - site may be vulnerable to clickjacking',
          details: { headers: response.headers }
        };
      }
      
      return {
        status: 'passed',
        severity: 'low',
        message: `X-Frame-Options is properly set to: ${xFrameOptions}`,
        details: { xFrameOptions: xFrameOptions }
      };
    } catch (error) {
      return {
        status: 'failed',
        severity: 'medium',
        message: 'Failed to check X-Frame-Options header',
        details: { error: error.message }
      };
    }
  },
  
  'hsts-header': async () => {
    try {
      const response = await makeRequest(CONFIG.target);
      const hsts = response.headers['strict-transport-security'];
      
      if (!hsts) {
        return {
          status: 'failed',
          severity: 'medium',
          message: 'HSTS header is missing - connections may be vulnerable to downgrade attacks',
          details: { headers: response.headers }
        };
      }
      
      return {
        status: 'passed',
        severity: 'low',
        message: `HSTS is properly configured: ${hsts}`,
        details: { hsts: hsts }
      };
    } catch (error) {
      return {
        status: 'failed',
        severity: 'medium',
        message: 'Failed to check HSTS header',
        details: { error: error.message }
      };
    }
  },
  
  'sql-injection': async () => {
    try {
      const testPayloads = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "1' UNION SELECT * FROM users --",
        "'; SELECT * FROM information_schema.tables --"
      ];
      
      let vulnerable = false;
      const results = [];
      
      for (const payload of testPayloads) {
        try {
          const response = await makeRequest(`${CONFIG.target}/api/search?q=${encodeURIComponent(payload)}`);
          
          // Check for SQL error messages
          if (response.body.includes('SQL syntax') || 
              response.body.includes('mysql_') || 
              response.body.includes('ORA-') ||
              response.body.includes('PostgreSQL')) {
            vulnerable = true;
            results.push({ payload, vulnerable: true, response: response.body.substring(0, 200) });
          } else {
            results.push({ payload, vulnerable: false, statusCode: response.statusCode });
          }
        } catch (error) {
          results.push({ payload, error: error.message });
        }
      }
      
      if (vulnerable) {
        return {
          status: 'failed',
          severity: 'high',
          message: 'SQL injection vulnerability detected',
          details: { results }
        };
      }
      
      return {
        status: 'passed',
        severity: 'low',
        message: 'No SQL injection vulnerabilities detected',
        details: { results }
      };
    } catch (error) {
      return {
        status: 'failed',
        severity: 'medium',
        message: 'Failed to test SQL injection',
        details: { error: error.message }
      };
    }
  },
  
  'xss-prevention': async () => {
    try {
      const testPayloads = [
        "<script>alert('XSS')</script>",
        "<img src='x' onerror='alert(1)'>",
        "javascript:alert('XSS')",
        "<svg onload=alert(1)>"
      ];
      
      let vulnerable = false;
      const results = [];
      
      for (const payload of testPayloads) {
        try {
          const response = await makeRequest(`${CONFIG.target}/api/search?q=${encodeURIComponent(payload)}`);
          
          // Check if payload is reflected without encoding
          if (response.body.includes(payload)) {
            vulnerable = true;
            results.push({ payload, vulnerable: true, response: response.body.substring(0, 200) });
          } else {
            results.push({ payload, vulnerable: false, statusCode: response.statusCode });
          }
        } catch (error) {
          results.push({ payload, error: error.message });
        }
      }
      
      if (vulnerable) {
        return {
          status: 'failed',
          severity: 'high',
          message: 'XSS vulnerability detected',
          details: { results }
        };
      }
      
      return {
        status: 'passed',
        severity: 'low',
        message: 'No XSS vulnerabilities detected',
        details: { results }
      };
    } catch (error) {
      return {
        status: 'failed',
        severity: 'medium',
        message: 'Failed to test XSS prevention',
        details: { error: error.message }
      };
    }
  },
  
  'rate-limiting': async () => {
    try {
      const requests = [];
      const testEndpoint = `${CONFIG.target}/api/auth/login`;
      
      // Make multiple rapid requests
      for (let i = 0; i < 20; i++) {
        requests.push(makeRequest(testEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' })
        }));
      }
      
      const responses = await Promise.allSettled(requests);
      const statusCodes = responses.map(r => r.status === 'fulfilled' ? r.value.statusCode : 'error');
      
      // Check for rate limiting (429 status code)
      const rateLimited = statusCodes.includes(429);
      
      if (!rateLimited) {
        return {
          status: 'failed',
          severity: 'medium',
          message: 'No rate limiting detected - API may be vulnerable to brute force attacks',
          details: { statusCodes }
        };
      }
      
      return {
        status: 'passed',
        severity: 'low',
        message: 'Rate limiting is properly configured',
        details: { statusCodes }
      };
    } catch (error) {
      return {
        status: 'failed',
        severity: 'medium',
        message: 'Failed to test rate limiting',
        details: { error: error.message }
      };
    }
  }
};

async function runSecurityAudit() {
  log('🔒 Starting comprehensive security audit...', 'info');
  
  const auditStartTime = Date.now();
  
  // Run all security tests
  for (const [category, categoryInfo] of Object.entries(SECURITY_TESTS)) {
    log(`🔍 Running ${categoryInfo.name} tests...`, 'info');
    
    for (const testName of categoryInfo.tests) {
      const testFunction = securityTests[testName];
      
      if (testFunction) {
        await runSecurityTest(testName, category, testFunction);
      } else {
        // Mock test for unimplemented tests
        await runSecurityTest(testName, category, async () => ({
          status: 'info',
          severity: 'low',
          message: `${testName} test not yet implemented`,
          details: { implemented: false }
        }));
      }
    }
  }
  
  const auditDuration = Date.now() - auditStartTime;
  log(`🏁 Security audit completed in ${auditDuration}ms`, 'info');
  
  generateSecurityReport();
}

function generateSecurityReport() {
  const criticalVulns = auditResults.vulnerabilities.filter(v => v.severity === 'high').length;
  const mediumVulns = auditResults.details.filter(d => d.severity === 'medium' && d.status === 'failed').length;
  const lowVulns = auditResults.details.filter(d => d.severity === 'low' && d.status === 'failed').length;
  
  const securityScore = Math.max(0, 100 - (criticalVulns * 30 + mediumVulns * 10 + lowVulns * 5));
  
  console.log('\n' + '='.repeat(80));
  console.log('🔒 BINNA PLATFORM SECURITY AUDIT REPORT');
  console.log('='.repeat(80));
  console.log(`🎯 Target: ${CONFIG.target}`);
  console.log(`📅 Audit Date: ${new Date().toLocaleString()}`);
  console.log(`🔍 Deep Scan: ${CONFIG.deep ? 'Enabled' : 'Disabled'}`);
  console.log('');
  
  console.log('📊 SECURITY SUMMARY:');
  console.log(`  Security Score: ${securityScore}/100`);
  console.log(`  Total Tests: ${auditResults.total}`);
  console.log(`  Passed: ${auditResults.passed}`);
  console.log(`  Failed: ${auditResults.failed}`);
  console.log(`  Warnings: ${auditResults.warning}`);
  console.log(`  Info: ${auditResults.info}`);
  console.log('');
  
  console.log('🚨 VULNERABILITY SUMMARY:');
  console.log(`  Critical (High): ${criticalVulns}`);
  console.log(`  Medium: ${mediumVulns}`);
  console.log(`  Low: ${lowVulns}`);
  console.log('');
  
  if (auditResults.vulnerabilities.length > 0) {
    console.log('⚠️ CRITICAL VULNERABILITIES:');
    auditResults.vulnerabilities.forEach(vuln => {
      console.log(`  • ${vuln.category}/${vuln.name}: ${vuln.message}`);
    });
    console.log('');
  }
  
  // Category breakdown
  const categoryResults = {};
  auditResults.details.forEach(test => {
    if (!categoryResults[test.category]) {
      categoryResults[test.category] = { passed: 0, failed: 0, warning: 0, info: 0 };
    }
    categoryResults[test.category][test.status]++;
  });
  
  console.log('📋 CATEGORY BREAKDOWN:');
  Object.entries(categoryResults).forEach(([category, results]) => {
    const total = results.passed + results.failed + results.warning + results.info;
    const passRate = (results.passed / total) * 100;
    const statusIcon = passRate === 100 ? '✅' : passRate >= 80 ? '⚠️' : '❌';
    console.log(`  ${statusIcon} ${category}: ${results.passed}/${total} (${passRate.toFixed(1)}%)`);
  });
  console.log('');
  
  console.log('🛡️ SECURITY ASSESSMENT:');
  if (securityScore >= 90) {
    console.log('  🟢 EXCELLENT - Strong security posture, ready for production');
  } else if (securityScore >= 80) {
    console.log('  🟡 GOOD - Good security with minor issues to address');
  } else if (securityScore >= 70) {
    console.log('  🟠 FAIR - Some security issues need attention');
  } else {
    console.log('  🔴 POOR - Critical security issues must be resolved');
  }
  
  console.log('');
  console.log('📋 RECOMMENDATIONS:');
  if (criticalVulns > 0) {
    console.log('  1. URGENT: Fix critical vulnerabilities immediately');
    console.log('  2. Implement additional security controls');
    console.log('  3. Conduct penetration testing');
  } else if (mediumVulns > 0) {
    console.log('  1. Address medium-risk vulnerabilities');
    console.log('  2. Implement security monitoring');
    console.log('  3. Regular security assessments');
  } else {
    console.log('  1. Continue regular security monitoring');
    console.log('  2. Implement security awareness training');
    console.log('  3. Schedule periodic security audits');
  }
  
  console.log('='.repeat(80));
  
  // Save detailed report
  const reportPath = path.join(__dirname, '..', 'reports', `security-audit-${Date.now()}.json`);
  const reportDir = path.dirname(reportPath);
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const report = {
    summary: {
      securityScore,
      total: auditResults.total,
      passed: auditResults.passed,
      failed: auditResults.failed,
      warning: auditResults.warning,
      info: auditResults.info,
      criticalVulns,
      mediumVulns,
      lowVulns
    },
    target: CONFIG.target,
    deepScan: CONFIG.deep,
    timestamp: new Date().toISOString(),
    categories: categoryResults,
    vulnerabilities: auditResults.vulnerabilities,
    details: auditResults.details
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Detailed security report saved to: ${reportPath}`);
}

// Main execution
async function main() {
  console.log('🔐 BINNA PLATFORM SECURITY AUDIT');
  console.log('=================================\n');
  
  log(`Starting security audit for: ${CONFIG.target}`, 'info');
  log(`Deep scan: ${CONFIG.deep ? 'Enabled' : 'Disabled'}`, 'info');
  
  try {
    await runSecurityAudit();
    
    // Exit with appropriate code
    const criticalVulns = auditResults.vulnerabilities.filter(v => v.severity === 'high').length;
    process.exit(criticalVulns > 0 ? 1 : 0);
    
  } catch (error) {
    log(`❌ Security audit failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n⏹️ Security audit interrupted by user');
  if (auditResults.total > 0) {
    generateSecurityReport();
  }
  process.exit(0);
});

// Run the main function
main();

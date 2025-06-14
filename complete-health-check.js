#!/usr/bin/env node

/**
 * 🎯 Binaa ERP - Complete Application Health Check
 * This script verifies all components of your application
 */

const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');
require('dotenv').config({ path: '.env.local' });

class HealthChecker {
    constructor() {
        this.results = {
            environment: false,
            supabase: false,
            authentication: false,
            deployment: false,
            features: false
        };
        this.issues = [];
        this.recommendations = [];
    }

    log(emoji, message, color = 'white') {
        const colors = {
            green: '\x1b[32m',
            red: '\x1b[31m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            white: '\x1b[37m',
            reset: '\x1b[0m'
        };
        console.log(`${colors[color]}${emoji} ${message}${colors.reset}`);
    }

    async checkEnvironment() {
        this.log('📋', 'Checking Environment Variables...', 'blue');

        const requiredVars = [
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'SUPABASE_SERVICE_ROLE_KEY',
            'DATABASE_URL'
        ];

        const missing = [];
        requiredVars.forEach(varName => {
            if (process.env[varName]) {
                this.log('   ✅', `${varName}: Set`, 'green');
            } else {
                this.log('   ❌', `${varName}: Missing`, 'red');
                missing.push(varName);
            }
        });

        if (missing.length === 0) {
            this.results.environment = true;
            this.log('✅', 'Environment variables: PASSED', 'green');
        } else {
            this.issues.push(`Missing environment variables: ${missing.join(', ')}`);
            this.recommendations.push('Update your .env.local file with missing variables');
        }

        console.log('');
    }

    async checkSupabase() {
        this.log('🌐', 'Testing Supabase Connection...', 'blue');

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            this.log('   ❌', 'Cannot test - Missing credentials', 'red');
            return;
        }

        try {
            // Test URL accessibility
            const response = await fetch(supabaseUrl);
            if (response.ok) {
                this.log('   ✅', 'Supabase URL is accessible', 'green');
            } else {
                this.log('   ❌', `Supabase URL returned: ${response.status}`, 'red');
                this.issues.push(`Supabase URL returns ${response.status} - project may be paused or deleted`);
                this.recommendations.push('Check your Supabase dashboard and follow CRITICAL_SUPABASE_RECOVERY.md');
                return;
            }

            // Test client creation
            const supabase = createClient(supabaseUrl, supabaseKey);
            this.log('   ✅', 'Supabase client created successfully', 'green');

            // Test auth
            const { data: authData, error: authError } = await supabase.auth.getSession();
            if (authError) {
                this.log('   ⚠️', `Auth warning: ${authError.message}`, 'yellow');
            } else {
                this.log('   ✅', 'Authentication system accessible', 'green');
            }

            this.results.supabase = true;
            this.log('✅', 'Supabase connection: PASSED', 'green');

        } catch (error) {
            this.log('   ❌', `Connection failed: ${error.message}`, 'red');
            this.issues.push(`Supabase connection failed: ${error.message}`);
            this.recommendations.push('Verify your Supabase credentials and project status');
        }

        console.log('');
    }

    async checkFiles() {
        this.log('📁', 'Checking Critical Files...', 'blue');

        const criticalFiles = [
            { path: 'src/app/api/auth/login/route.ts', name: 'Login API' },
            { path: 'src/app/user/dashboard/page.tsx', name: 'User Dashboard' },
            { path: 'src/app/page.tsx', name: 'Landing Page' },
            { path: '.env.local', name: 'Environment File' },
            { path: 'package.json', name: 'Package Configuration' }
        ];

        const fs = require('fs');
        let allExist = true;

        criticalFiles.forEach(file => {
            if (fs.existsSync(file.path)) {
                this.log('   ✅', `${file.name}: Exists`, 'green');
            } else {
                this.log('   ❌', `${file.name}: Missing`, 'red');
                allExist = false;
                this.issues.push(`Missing critical file: ${file.path}`);
            }
        });

        if (allExist) {
            this.results.features = true;
            this.log('✅', 'Critical files: PASSED', 'green');
        }

        console.log('');
    }

    async checkDeployment() {
        this.log('🚀', 'Checking Deployment Status...', 'blue');

        try {
            // Check if Vercel CLI is available
            execSync('vercel --version', { stdio: 'ignore' });
            
            // Get deployment info
            const deploymentInfo = execSync('vercel ls --json', { encoding: 'utf8', stdio: 'pipe' });
            const deployments = JSON.parse(deploymentInfo);
            
            if (deployments && deployments.length > 0) {
                const latest = deployments[0];
                this.log('   ✅', `Latest deployment: ${latest.url}`, 'green');
                this.log('   ✅', `Status: ${latest.state}`, 'green');
                this.results.deployment = true;
            } else {
                this.log('   ⚠️', 'No deployments found', 'yellow');
                this.recommendations.push('Deploy your application: vercel --prod');
            }

        } catch (error) {
            this.log('   ⚠️', 'Cannot check deployment (Vercel CLI not available)', 'yellow');
            this.recommendations.push('Install Vercel CLI: npm install -g vercel');
        }

        console.log('');
    }

    generateReport() {
        console.log('');
        this.log('📊', 'HEALTH CHECK REPORT', 'blue');
        console.log(''.padEnd(50, '='));

        // Summary
        const passed = Object.values(this.results).filter(Boolean).length;
        const total = Object.keys(this.results).length;
        const percentage = Math.round((passed / total) * 100);

        this.log('📈', `Overall Health: ${percentage}% (${passed}/${total} checks passed)`, 
                 percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red');

        // Individual results
        Object.entries(this.results).forEach(([check, passed]) => {
            const emoji = passed ? '✅' : '❌';
            const color = passed ? 'green' : 'red';
            this.log(emoji, `${check.charAt(0).toUpperCase() + check.slice(1)}: ${passed ? 'PASSED' : 'FAILED'}`, color);
        });

        // Issues
        if (this.issues.length > 0) {
            console.log('');
            this.log('🚨', 'ISSUES FOUND:', 'red');
            this.issues.forEach((issue, index) => {
                this.log('   •', `${index + 1}. ${issue}`, 'red');
            });
        }

        // Recommendations
        if (this.recommendations.length > 0) {
            console.log('');
            this.log('💡', 'RECOMMENDATIONS:', 'yellow');
            this.recommendations.forEach((rec, index) => {
                this.log('   •', `${index + 1}. ${rec}`, 'yellow');
            });
        }

        console.log('');
        
        // Next steps
        if (percentage === 100) {
            this.log('🎉', 'All checks passed! Your application is ready to go!', 'green');
            this.log('🔗', 'Test your application:', 'blue');
            this.log('   •', 'Local: http://localhost:3000', 'white');
            this.log('   •', 'Production: Check your Vercel dashboard', 'white');
        } else if (percentage >= 60) {
            this.log('⚠️', 'Some issues found, but your app might still work', 'yellow');
            this.log('🔧', 'Follow the recommendations above to improve reliability', 'yellow');
        } else {
            this.log('🚨', 'Critical issues found - app likely not working', 'red');
            this.log('📖', 'Follow CRITICAL_SUPABASE_RECOVERY.md for step-by-step fixes', 'red');
        }
    }

    async run() {
        console.log('🎯 Binaa ERP - Complete Application Health Check');
        console.log(''.padEnd(50, '='));
        console.log('');

        await this.checkEnvironment();
        await this.checkSupabase();
        await this.checkFiles();
        await this.checkDeployment();
        
        this.generateReport();
    }
}

// Run the health check
if (require.main === module) {
    const checker = new HealthChecker();
    checker.run().catch(console.error);
}

module.exports = HealthChecker;

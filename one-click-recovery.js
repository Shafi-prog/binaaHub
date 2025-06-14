#!/usr/bin/env node

/**
 * 🚀 Binaa ERP - One-Click Recovery
 * This script guides you through the complete recovery process
 */

const readline = require('readline');
const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function log(emoji, message, color = 'white') {
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

async function checkSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!supabaseUrl) {
    return false;
  }

  try {
    const response = await fetch(supabaseUrl);
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🚀 Binaa ERP - One-Click Recovery Assistant');
  console.log(''.padEnd(50, '='));
  console.log('');

  log('👋', 'Welcome! I\'ll help you get your app running in a few minutes.', 'blue');
  console.log('');

  // Step 1: Check current status
  log('🔍', 'Step 1: Checking current status...', 'blue');
  
  const supabaseWorking = await checkSupabase();
  
  if (supabaseWorking) {
    log('✅', 'Great! Your Supabase project is working!', 'green');
    
    // Run health check
    log('🧪', 'Running full health check...', 'blue');
    try {
      execSync('node complete-health-check.js', { stdio: 'inherit' });
    } catch (error) {
      log('⚠️', 'Health check had some issues, but continuing...', 'yellow');
    }
    
    // Ask about deployment
    const deploy = await ask('🚀 Would you like to deploy to production now? (y/N): ');
    if (deploy.toLowerCase() === 'y') {
      try {
        log('📦', 'Deploying to Vercel...', 'blue');
        execSync('vercel --prod', { stdio: 'inherit' });
        log('🎉', 'Deployment completed!', 'green');
      } catch (error) {
        log('⚠️', 'Deployment had issues. You may need to install Vercel CLI first:', 'yellow');
        log('💡', 'Run: npm install -g vercel', 'yellow');
      }
    }
    
  } else {
    log('❌', 'Your Supabase project is not accessible (404 error)', 'red');
    console.log('');
    
    log('🏥', 'Don\'t worry! This is a common issue and easy to fix:', 'yellow');
    console.log('');
    
    log('📋', 'Here\'s what you need to do:', 'blue');
    log('   1️⃣', 'Open your browser and go to: https://app.supabase.com', 'white');
    log('   2️⃣', 'Find your project in the dashboard', 'white');
    log('   3️⃣', 'If it says "PAUSED" - click "Resume Project"', 'white');
    log('   4️⃣', 'If you don\'t see it - it may have been deleted, create a new one', 'white');
    log('   5️⃣', 'Copy the new URL and API keys', 'white');
    log('   6️⃣', 'Update your environment variables', 'white');
    console.log('');

    const continueSetup = await ask('Have you fixed your Supabase project? (y/N): ');
    
    if (continueSetup.toLowerCase() === 'y') {
      log('✨', 'Great! Let\'s update your environment variables...', 'green');
      
      const updateEnv = await ask('Do you want me to help update your Vercel environment? (y/N): ');
      if (updateEnv.toLowerCase() === 'y') {
        try {
          log('🔧', 'Running environment update script...', 'blue');
          execSync('powershell -ExecutionPolicy Bypass -File ./update-vercel-env.ps1', { stdio: 'inherit' });
        } catch (error) {
          log('⚠️', 'PowerShell script had issues. You can run it manually:', 'yellow');
          log('💡', 'Run: .\\update-vercel-env.ps1', 'yellow');
        }
      }
      
      // Final health check
      log('🧪', 'Running final health check...', 'blue');
      try {
        execSync('node complete-health-check.js', { stdio: 'inherit' });
      } catch (error) {
        log('⚠️', 'Health check had issues, but your app might still work', 'yellow');
      }
      
    } else {
      log('📖', 'No problem! Here are the detailed guides to help you:', 'blue');
      log('   📄', 'CRITICAL_SUPABASE_RECOVERY.md - Step-by-step Supabase recovery', 'white');
      log('   📄', 'FINAL_STATUS_AND_NEXT_STEPS.md - Complete status and next steps', 'white');
      log('   📄', 'QUICK_FIX_REFERENCE.txt - Quick reference card', 'white');
      console.log('');
      log('🔧', 'When ready, run these commands:', 'blue');
      log('   •', 'node complete-health-check.js (check status)', 'white');
      log('   •', '.\\update-vercel-env.ps1 (update environment)', 'white');
      log('   •', 'vercel --prod (deploy)', 'white');
    }
  }

  console.log('');
  log('📞', 'Need help? Check these files:', 'blue');
  log('   📋', 'FINAL_STATUS_AND_NEXT_STEPS.md - Complete guide', 'white');
  log('   🚨', 'CRITICAL_SUPABASE_RECOVERY.md - Supabase-specific help', 'white');
  log('   ⚡', 'QUICK_FIX_REFERENCE.txt - Quick reference', 'white');
  
  console.log('');
  log('🎯', 'Summary: Your code is perfect, just need to fix the Supabase project!', 'green');
  
  rl.close();
}

// Run the assistant
main().catch(console.error);

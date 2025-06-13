#!/usr/bin/env node

// Script to start both main app and Medusa backend
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting BinnaHub with Medusa Integration');
console.log('============================================\n');

// Function to spawn a process and handle output
function startProcess(name, command, args, cwd) {
  console.log(`Starting ${name}...`);
  
  const process = spawn(command, args, {
    cwd: cwd,
    stdio: 'pipe',
    shell: true
  });

  // Prefix output with service name
  process.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      console.log(`[${name}] ${line}`);
    });
  });

  process.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      console.log(`[${name}] ${line}`);
    });
  });

  process.on('close', (code) => {
    console.log(`[${name}] Process exited with code ${code}`);
  });

  return process;
}

// Start Medusa backend
const medusaBackend = startProcess(
  'MEDUSA', 
  'npm', 
  ['run', 'dev'], 
  path.join(__dirname, 'medusa-backend')
);

// Wait a bit for Medusa to start, then start the main app
setTimeout(() => {
  const mainApp = startProcess(
    'BINNA', 
    'npx', 
    ['next', 'dev', '-p', '3001'], 
    __dirname
  );
}, 3000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down services...');
  medusaBackend.kill();
  process.exit();
});

console.log('📋 Services starting:');
console.log('- Medusa Backend: http://localhost:9000');
console.log('- Medusa Admin: http://localhost:7001');
console.log('- BinnaHub App: http://localhost:3001');
console.log('\nPress Ctrl+C to stop all services\n');

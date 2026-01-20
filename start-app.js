#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting MERN Stack Bookstore Application...\n');

// Start backend
console.log('📡 Starting Backend Server...');
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

// Wait a bit for backend to start, then start frontend
setTimeout(() => {
  console.log('\n🌐 Starting Frontend Server...');
  const frontend = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, PORT: '3001', BROWSER: 'none' }
  });

  frontend.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output.includes('compiled successfully')) {
      console.log('\n🎉 MERN Stack Application is Ready!');
      console.log('\n📋 Access URLs:');
      console.log('   Frontend: http://localhost:3001');
      console.log('   Backend:  http://localhost:8000');
      console.log('   API:      http://localhost:8000/api');
      console.log('\n💡 Press Ctrl+C to stop both servers\n');
    }
    console.log(`[Frontend] ${output}`);
  });

  frontend.stderr.on('data', (data) => {
    const error = data.toString().trim();
    if (!error.includes('DeprecationWarning')) {
      console.error(`[Frontend Error] ${error}`);
    }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });

}, 3000);

// Handle backend errors
backend.on('error', (error) => {
  console.error('Failed to start backend:', error);
});

backend.on('close', (code) => {
  if (code !== 0) {
    console.error(`Backend process exited with code ${code}`);
  }
});
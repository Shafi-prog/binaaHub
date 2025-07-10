#!/bin/bash

# Start Unified Medusa Server & Next.js Development Script
# This script starts both the unified Medusa server and Next.js frontend

echo "🚀 Starting Unified Medusa & Next.js Development Environment"
echo "==========================================================="

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $MEDUSA_PID $NEXTJS_PID 2>/dev/null
    exit 0
}

# Trap SIGINT (Ctrl+C) to cleanup
trap cleanup SIGINT

# Start Medusa Unified Server
echo "📦 Starting Medusa Unified Server (Port 9000)..."
cd "c:/Users/hp/BinnaCodes/binna/medusa-develop/packages/medusa"
node unified-medusa-server.js &
MEDUSA_PID=$!
echo "   ✅ Medusa Server PID: $MEDUSA_PID"

# Wait a moment for Medusa to start
sleep 3

# Start Next.js Development Server
echo "⚡ Starting Next.js Development Server (Port 3000)..."
cd "c:/Users/hp/BinnaCodes/binna"
npm run dev &
NEXTJS_PID=$!
echo "   ✅ Next.js Server PID: $NEXTJS_PID"

echo ""
echo "🎉 Both servers are starting up!"
echo "📍 Medusa Unified Server: http://localhost:9000"
echo "   🛒 Store API: http://localhost:9000/store/products"
echo "   👨‍💼 Admin Dashboard: http://localhost:9000/admin"
echo "   ❤️  Health Check: http://localhost:9000/health"
echo ""
echo "📍 Next.js Frontend: http://localhost:3000"
echo "   🎯 Medusa Demo: http://localhost:3000/medusa-demo"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "==========================================================="

# Wait for both processes
wait $MEDUSA_PID $NEXTJS_PID

#!/bin/bash

# Render deployment startup script
# This ensures the server starts correctly and responds to health checks

set -e

echo "Starting Roblox UI Designer Pro..."
echo "=================================="

# Check if dist/index.cjs exists
if [ ! -f "dist/index.cjs" ]; then
    echo "ERROR: dist/index.cjs not found"
    exit 1
fi

echo "✓ Server bundle verified"
echo "✓ Starting Node.js server..."

# Start the server with proper error handling
exec node dist/index.cjs

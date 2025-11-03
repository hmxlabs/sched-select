#!/bin/bash

# Start script for Scheduler Selection API

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "❌ Error: Virtual environment not found. Run ./setup.sh first."
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  Warning: .env file not found"
fi

# Start the server
echo "🚀 Starting Scheduler Selection API..."
echo "📖 API docs available at: http://localhost:8000/docs"
echo "🌐 API running at: http://localhost:8000"
echo ""
uvicorn app.main:app --host 0.0.0.0 --port 8000


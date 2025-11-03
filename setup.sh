#!/bin/bash

# Setup script for Scheduler Selection API
# This script sets up the database and imports initial data

set -e  # Exit on error

echo "🚀 Setting up Scheduler Selection API..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please create a .env file with your database configuration."
    echo "   You can copy .env.example and update it with your values."
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if PostgreSQL is accessible
echo "🔍 Checking PostgreSQL connection..."
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql command not found. Please install PostgreSQL client."
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set, constructing from individual variables..."
    
    if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ]; then
        echo "❌ Error: DB_USER, DB_PASSWORD, and DB_NAME must be set in .env"
        exit 1
    fi
    
    DB_HOST=${DB_HOST:-localhost}
    DB_PORT=${DB_PORT:-5432}
    export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

# Create database if it doesn't exist
echo "📦 Creating database if it doesn't exist..."
DB_NAME=$(echo $DATABASE_URL | grep -oP '(?<=/)[^/?]+' | tail -1)
DB_USER=$(echo $DATABASE_URL | grep -oP '(?<=://)[^:]+')
DB_PASS=$(echo $DATABASE_URL | grep -oP '(?<=://[^:]+:)[^@]+')
DB_HOST=$(echo $DATABASE_URL | grep -oP '(?<=@)[^:]+')
DB_PORT=$(echo $DATABASE_URL | grep -oP '(?<=:)[0-9]+(?=/)' | tail -1)

# Connect to postgres database to create the target database
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
    PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"

echo "✅ Database ready"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🐍 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Import data
echo "📊 Importing initial data..."
python import_data.py

echo "✅ Setup complete!"
echo ""
echo "🎉 Your API is ready to run!"
echo "   Start the server with: source venv/bin/activate && uvicorn app.main:app --reload"
echo "   Or use: ./start.sh"


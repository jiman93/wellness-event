#!/bin/bash

# Wellness Event Platform Deployment Script for Fly.io

set -e

echo "🚀 Starting deployment to Fly.io..."

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI is not installed. Please install it first:"
    echo "curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if user is logged in
if ! fly auth whoami &> /dev/null; then
    echo "❌ Not logged in to Fly.io. Please run: fly auth login"
    exit 1
fi

# Create app if it doesn't exist
if ! fly apps list | grep -q "wellness-event-platform"; then
    echo "📱 Creating Fly.io app..."
    fly apps create wellness-event-platform
fi

# Create volume if it doesn't exist
if ! fly volumes list | grep -q "wellness_mongo_data"; then
    echo "💾 Creating MongoDB volume..."
    fly volumes create wellness_mongo_data --size 3 --region iad
fi

# Set secrets from environment variables or use defaults
echo "🔐 Setting environment secrets..."
fly secrets set NODE_ENV=production

# Use environment variables if available, otherwise prompt
if [ -n "$MONGODB_URI" ]; then
    fly secrets set MONGODB_URI="$MONGODB_URI"
else
    echo "⚠️  MONGODB_URI not set. Please set it manually:"
    echo "fly secrets set MONGODB_URI=\"your-production-mongodb-uri\""
fi

if [ -n "$CLIENT_URL" ]; then
    fly secrets set CLIENT_URL="$CLIENT_URL"
else
    fly secrets set CLIENT_URL="https://wellness-event-platform.fly.dev"
fi

if [ -n "$JWT_SECRET" ]; then
    fly secrets set JWT_SECRET="$JWT_SECRET"
else
    echo "⚠️  JWT_SECRET not set. Please set it manually:"
    echo "fly secrets set JWT_SECRET=\"your-super-secret-jwt-key\""
fi

# Deploy
echo "🚀 Deploying application..."
fly deploy

echo "✅ Deployment completed!"
echo "🌐 Your app is available at: https://wellness-event-platform.fly.dev"
echo "📊 Monitor your app with: fly status" 
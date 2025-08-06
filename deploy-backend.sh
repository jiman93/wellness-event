#!/bin/bash

# Wellness Event Platform Backend - Fly.io Deployment Script

set -e  # Exit on any error

echo "🚀 Starting backend deployment to Fly.io..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Fly CLI is installed
if ! command -v fly &> /dev/null; then
    print_error "Fly CLI is not installed. Please install it first:"
    echo "curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if user is logged in
if ! fly auth whoami &> /dev/null; then
    print_warning "You are not logged in to Fly.io. Please login:"
    fly auth login
fi

# Get app name from fly.server.toml
APP_NAME=$(grep 'app = ' fly.server.toml | cut -d'"' -f2)

print_status "Deploying backend to app: $APP_NAME"

# Check if app exists, create if not
if ! fly apps list | grep -q "$APP_NAME"; then
    print_status "Creating new Fly.io app: $APP_NAME"
    fly apps create "$APP_NAME" --org personal
    print_success "Backend app created successfully"
else
    print_status "Backend app $APP_NAME already exists"
fi

# Set up environment secrets
print_status "Setting up environment secrets..."

# Generate secure values if not provided
if [ -z "$MONGODB_URI" ]; then
    print_warning "MONGODB_URI not set. Using local MongoDB for development."
    print_warning "For production, set MONGODB_URI to your MongoDB Atlas or other cloud database."
    MONGODB_URI="mongodb://admin:password@localhost:27017/wellness-events?authSource=admin"
fi

if [ -z "$JWT_SECRET" ]; then
    print_warning "JWT_SECRET not set. Generating a secure random secret..."
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
fi

if [ -z "$CLIENT_URL" ]; then
    CLIENT_URL="https://wellness-event-platform.fly.dev"
fi

# Set secrets
print_status "Setting Fly.io secrets..."
fly secrets set \
    NODE_ENV=production \
    MONGODB_URI="$MONGODB_URI" \
    JWT_SECRET="$JWT_SECRET" \
    CLIENT_URL="$CLIENT_URL" \
    --app "$APP_NAME"

print_success "Backend secrets configured successfully"

# Deploy the backend application
print_status "Deploying backend application..."
fly deploy --remote-only --config fly.server.toml

print_success "Backend deployment completed successfully!"

echo ""
echo "🎉 Your Wellness Event Platform Backend is now live!"
echo ""
echo "📱 Backend API URL: https://$APP_NAME.fly.dev"
echo "📱 Frontend URL: https://wellness-event-platform.fly.dev"
echo ""
echo "🔗 API Endpoints:"
echo "  • Health: https://$APP_NAME.fly.dev/health"
echo "  • Auth: https://$APP_NAME.fly.dev/auth"
echo "  • Events: https://$APP_NAME.fly.dev/wellness-events"
echo "  • Event Types: https://$APP_NAME.fly.dev/event-types"
echo "  • Vendors: https://$APP_NAME.fly.dev/vendors"
echo ""
echo "📊 Monitor your backend:"
echo "  • Dashboard: https://fly.io/apps/$APP_NAME"
echo "  • Logs: fly logs -a $APP_NAME"
echo "  • Status: fly status -a $APP_NAME"
echo ""
echo "🔧 Useful commands:"
echo "  • View logs: fly logs -a $APP_NAME"
echo "  • SSH into app: fly ssh console -a $APP_NAME"
echo "  • Scale app: fly scale count 2 -a $APP_NAME"
echo "  • Destroy app: fly apps destroy $APP_NAME"
echo ""
print_success "Backend deployment script completed!" 
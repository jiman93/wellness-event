#!/bin/bash

# Wellness Event Platform Environment Setup Script

echo "🔐 Setting up environment variables for Wellness Event Platform..."

# Function to generate a secure random string
generate_secret() {
    openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64
}

# Check if .env files already exist
if [ -f "server/.env" ]; then
    echo "⚠️  server/.env already exists. Skipping..."
else
    echo "📝 Creating server/.env..."
    cp server/env.example server/.env
    
    # Generate a secure JWT secret
    JWT_SECRET=$(generate_secret)
    sed -i.bak "s/your-super-secret-jwt-key-here/$JWT_SECRET/" server/.env
    rm server/.env.bak 2>/dev/null || true
    
    echo "✅ server/.env created with secure JWT secret"
fi

if [ -f "infra/.env" ]; then
    echo "⚠️  infra/.env already exists. Skipping..."
else
    echo "📝 Creating infra/.env..."
    cp infra/env.example infra/.env
    
    # Generate secure passwords
    MONGO_PASSWORD=$(generate_secret | tr -d "=+/" | cut -c1-16)
    JWT_SECRET=$(generate_secret)
    
    # Replace placeholders with secure values
    sed -i.bak "s/your-secure-password-here/$MONGO_PASSWORD/g" infra/.env
    sed -i.bak "s/your-super-secret-jwt-key-here/$JWT_SECRET/" infra/.env
    rm infra/.env.bak 2>/dev/null || true
    
    echo "✅ infra/.env created with secure passwords"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review the generated .env files:"
echo "   - server/.env"
echo "   - infra/.env"
echo ""
echo "2. Start the application:"
echo "   cd infra && docker-compose up --build"
echo ""
echo "3. When ready to deploy:"
echo "   fly secrets set MONGODB_URI=\"your-production-mongodb-uri\""
echo "   fly secrets set JWT_SECRET=\"your-production-jwt-secret\""
echo ""
echo "🔒 Security notes:"
echo "- Generated passwords are secure and random"
echo "- .env files are already in .gitignore"
echo "- Never commit these files to version control" 
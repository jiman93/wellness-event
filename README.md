# Wellness Event Platform

A full-stack wellness event management platform built with React, Express, and MongoDB.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful UI components
- **React Router** for navigation

### Backend
- **Node.js** with TypeScript
- **Express.js** for API server
- **Mongoose** for MongoDB ODM
- **Jest** for testing

### Infrastructure
- **Docker** for containerization
- **Docker Compose** for local development
- **Fly.io** for production deployment
- **MongoDB** for database

## 📁 Project Structure

```
wellness-event/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── middleware/    # Express middleware
│   ├── package.json
│   └── tsconfig.json
├── infra/                  # Infrastructure files
│   ├── Dockerfile.client  # Client Dockerfile
│   ├── Dockerfile.server  # Server Dockerfile
│   ├── docker-compose.yml # Local development
│   ├── fly.toml          # Fly.io deployment
│   └── nginx.conf        # Nginx configuration
├── package.json           # Root package.json
└── tsconfig.base.json    # Shared TypeScript config
```

## 🔐 Security Setup

**⚠️ IMPORTANT: Before pushing to GitHub, set up your environment variables!**

### 1. Create Environment Files

**For local development:**
```bash
# Copy the example files
cp server/env.example server/.env
cp infra/env.example infra/.env

# Edit the files with your secure values
nano server/.env
nano infra/.env
```

**For production deployment:**
```bash
# Set Fly.io secrets
fly secrets set MONGODB_URI="your-production-mongodb-uri"
fly secrets set JWT_SECRET="your-super-secret-jwt-key"
fly secrets set CLIENT_URL="https://your-app.fly.dev"
```

### 2. Environment Variables

**Server (.env):**
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://admin:your-secure-password@mongo:27017/wellness-events?authSource=admin
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-here
```

**Docker Compose (infra/.env):**
```bash
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-password-here
MONGO_DATABASE=wellness-events
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://admin:your-secure-password-here@mongo:27017/wellness-events?authSource=admin
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-here
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wellness-event
   ```

2. **Set up environment variables**
   ```bash
   cp server/env.example server/.env
   cp infra/env.example infra/.env
   # Edit both files with secure values
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start with Docker Compose (Recommended)**
   ```bash
   cd infra
   docker-compose up --build
   ```
   
   This will start:
   - MongoDB on port 27017
   - Express API on port 5000
   - React client on port 3000

5. **Or start services individually**
   ```bash
   # Start client
   npm run client:dev
   
   # Start server (in another terminal)
   npm run server:dev
   ```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests for specific workspace
npm test --workspace=server
npm test --workspace=client
```

## 🏗️ Building

```bash
# Build all workspaces
npm run build

# Build specific workspace
npm run build --workspace=client
npm run build --workspace=server
```

## 🚀 Production Deployment

### Deploy to Fly.io

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**
   ```bash
   fly auth login
   ```

3. **Set up environment variables**
   ```bash
   # Set production secrets
   fly secrets set NODE_ENV=production
   fly secrets set MONGODB_URI="your-production-mongodb-uri"
   fly secrets set JWT_SECRET="your-super-secret-jwt-key"
   fly secrets set CLIENT_URL="https://your-app.fly.dev"
   ```

4. **Create the app**
   ```bash
   fly apps create wellness-event-platform
   ```

5. **Create MongoDB volume**
   ```bash
   fly volumes create wellness_mongo_data --size 3 --region iad
   ```

6. **Deploy**
   ```bash
   fly deploy
   ```

## 📚 API Documentation

### Events Endpoints

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/join` - Join event

### Health Check

- `GET /health` - API health status

## 🎨 Features

- **Event Management**: Create, read, update, delete wellness events
- **User Registration**: Join events with attendee tracking
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live event status and attendee counts
- **Category Filtering**: Filter events by wellness categories
- **Modern UI**: Beautiful components with shadcn/ui

## 🔧 Development Scripts

```bash
# Root level scripts
npm run dev              # Start both client and server
npm run client:dev       # Start client only
npm run server:dev       # Start server only
npm run build            # Build all workspaces
npm run test             # Run all tests
npm run lint             # Lint all workspaces

# Client scripts
npm run dev --workspace=client
npm run build --workspace=client
npm run preview --workspace=client

# Server scripts
npm run dev --workspace=server
npm run build --workspace=server
npm run start --workspace=server
```

## 🔒 Security Best Practices

1. **Never commit .env files** - They're already in .gitignore
2. **Use strong passwords** - Generate secure passwords for MongoDB
3. **Rotate secrets regularly** - Change JWT secrets periodically
4. **Use environment-specific configs** - Different values for dev/staging/prod
5. **Validate environment variables** - Check required vars on startup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Set up your environment variables
4. Make your changes
5. Add tests if applicable
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 
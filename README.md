# Wellness Event Management Platform

A full-stack wellness event management platform built with React, Express, and MongoDB. The platform enables HR professionals to create wellness events and vendors to manage and respond to event requests.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful UI components
- **React Router** for navigation
- **React Query** for data fetching and state management
- **Lucide React** for icons

### Backend
- **Node.js** with TypeScript
- **Express.js** for API server
- **Mongoose** for MongoDB ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Jest** for testing

### Infrastructure
- **Docker** for containerization
- **Docker Compose** for local development
- **Fly.io** for production deployment
- **MongoDB** for database
- **Nginx** as reverse proxy

## 📁 Project Structure

```
wellness-event/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── HRDashboard.tsx
│   │   │   ├── VendorDashboard.tsx
│   │   │   ├── EventDetailModal.tsx
│   │   │   ├── CreateEventModal.tsx
│   │   │   └── Header.tsx
│   │   ├── contexts/      # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── wellnessEventController.ts
│   │   │   ├── eventTypeController.ts
│   │   │   └── vendorController.ts
│   │   ├── models/        # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── Event.ts
│   │   │   └── EventType.ts
│   │   ├── routes/        # API routes
│   │   │   ├── auth.ts
│   │   │   ├── wellnessEvents.ts
│   │   │   ├── eventTypes.ts
│   │   │   └── vendors.ts
│   │   └── middleware/    # Express middleware
│   │       ├── authMiddleware.ts
│   │       └── errorHandler.ts
│   ├── package.json
│   └── tsconfig.json
├── infra/                  # Infrastructure files
│   ├── Dockerfile.client  # Client Dockerfile
│   ├── Dockerfile.server  # Server Dockerfile
│   ├── docker-compose.yml # Local development
│   ├── fly.toml          # Fly.io deployment
│   ├── nginx.conf        # Nginx configuration
│   └── mongo-init.js     # MongoDB initialization script
├── package.json           # Root package.json
└── tsconfig.base.json    # Shared TypeScript config
```

## 🔐 Authentication & Roles

The platform supports two user roles:

### HR Users
- **Company HR Dashboard**: View all wellness events for their company
- **Create Events**: Create new wellness events with vendor selection
- **Event Management**: Track event status and vendor responses
- **Company-wide View**: See events created by all HR users in the same company

### Vendor Users
- **Vendor Dashboard**: View events assigned to them
- **Event Actions**: Approve or reject event requests
- **Date Selection**: Choose from proposed dates when approving
- **Remarks**: Provide rejection reasons when declining

## 🎯 Key Features

### Authentication System
- **JWT-based authentication** with secure token storage
- **Role-based access control** (HR vs Vendor)
- **Protected routes** with automatic redirection
- **Persistent login** with localStorage

### Event Management
- **Create Events**: HR users can create wellness events with:
  - Event type selection (Yoga, Meditation, Nutrition, etc.)
  - Vendor assignment
  - Three proposed dates
  - Location details (street address, postal code)
- **Event Status Tracking**: Pending → Approved/Rejected
- **Date Confirmation**: Vendors can select from proposed dates
- **Remarks System**: Vendors can provide rejection reasons

### Dashboard Features
- **HR Dashboard**:
  - Company-wide event listing
  - Event creation modal
  - Event details view
  - Status tracking
- **Vendor Dashboard**:
  - Assigned events listing
  - Approve/Reject actions
  - Event details with action buttons
  - Date selection for approvals

### UI/UX Features
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Modal Components**: Event details and creation modals
- **Loading States**: Proper loading indicators
- **Error Handling**: Graceful error display
- **Form Validation**: Client-side validation with error messages

## 🔐 Security Setup

**⚠️ IMPORTANT: Before pushing to GitHub, set up your environment variables!**

### 1. Automated Environment Setup (Recommended)

The project includes an automated setup script that generates secure environment variables:

```bash
# Make the setup script executable
chmod +x setup-env.sh

# Run the automated setup
./setup-env.sh
```

**What the script does:**
- ✅ Creates `server/.env` and `infra/.env` files from examples
- ✅ Generates secure random JWT secrets
- ✅ Creates secure MongoDB passwords
- ✅ Replaces all placeholder values automatically
- ✅ Skips creation if files already exist
- ✅ Provides clear next steps

### 2. Manual Environment Setup (Alternative)

If you prefer to set up manually:
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

2. **Set up environment variables (Automated)**
   ```bash
   # Make the setup script executable
   chmod +x setup-env.sh
   
   # Run the automated setup script
   ./setup-env.sh
   ```
   
   This script will:
   - Create `server/.env` and `infra/.env` files
   - Generate secure random passwords and JWT secrets
   - Replace placeholder values with secure ones
   - Skip creation if files already exist

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

5. **Access the application**
   - **Client**: http://localhost:3000
   - **API**: http://localhost:5000

### Demo Credentials

The system comes with pre-populated demo users:

**HR Users:**
- `john.smith@company.com` (TechCorp Inc.) - Password: `password123`
- `sarah.johnson@company.com` (TechCorp Inc.) - Password: `password123`

**Vendor Users:**
- `mike.chen@yogastudio.com` (Yoga) - Password: `password123`
- `lisa.garcia@meditation.com` (Meditation) - Password: `password123`
- `david.wilson@nutrition.com` (Nutrition) - Password: `password123`

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration (if needed)

### Wellness Events Endpoints
- `GET /wellness-events` - Get events (filtered by user role)
- `POST /wellness-events` - Create new event (HR only)
- `GET /wellness-events/:id` - Get single event
- `PATCH /wellness-events/:id/approve` - Approve event (Vendor only)
- `PATCH /wellness-events/:id/reject` - Reject event (Vendor only)

### Supporting Endpoints
- `GET /event-types` - Get all event types
- `GET /vendors` - Get all vendor users
- `GET /health` - API health status

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

#### Option 1: Automated Deployment (Recommended)

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**
   ```bash
   fly auth login
   ```

3. **Run the automated deployment script**
   ```bash
   # Make the script executable (if not already)
   chmod +x deploy.sh
   
   # Run the deployment
   ./deploy.sh
   ```

   The script will automatically:
   - ✅ Create the Fly.io app if it doesn't exist
   - ✅ Create MongoDB volume for data persistence
   - ✅ Generate secure JWT secrets
   - ✅ Set up all environment variables
   - ✅ Deploy your application
   - ✅ Provide you with the live URL and demo credentials

#### Option 2: Manual Deployment

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**
   ```bash
   fly auth login
   ```

3. **Create the app**
   ```bash
   fly apps create wellness-event-platform
   ```

4. **Create MongoDB volume**
   ```bash
   fly volumes create wellness_mongo_data --size 3 --region iad
   ```

5. **Set up environment variables**
   ```bash
   # Set production secrets
   fly secrets set NODE_ENV=production
   fly secrets set MONGODB_URI="your-production-mongodb-uri"
   fly secrets set JWT_SECRET="your-super-secret-jwt-key"
   fly secrets set CLIENT_URL="https://wellness-event-platform.fly.dev"
   ```

6. **Deploy**
   ```bash
   cd infra
   fly deploy
   ```

### 🗄️ Database Options

#### Option A: Use Fly.io MongoDB (Simple)
The deployment script will create a MongoDB volume on Fly.io for you. This is perfect for development and small to medium applications.

#### Option B: Use MongoDB Atlas (Recommended for Production)
For production applications, consider using MongoDB Atlas:

1. **Create a MongoDB Atlas cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string

2. **Set the MongoDB URI**
   ```bash
   fly secrets set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/wellness-events?retryWrites=true&w=majority"
   ```

### 📊 Post-Deployment

After deployment, you can:

- **View your app**: https://wellness-event-platform.fly.dev
- **Monitor logs**: `fly logs -a wellness-event-platform`
- **Check status**: `fly status -a wellness-event-platform`
- **Scale up**: `fly scale count 2 -a wellness-event-platform`
- **SSH into app**: `fly ssh console -a wellness-event-platform`

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

## 🎨 UI Components

The application uses a custom UI component library built with:
- **shadcn/ui** components (Button, Card, etc.)
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Custom modals** for event details and creation
- **Responsive tables** for event listings

## 🔒 Security Best Practices

1. **Never commit .env files** - They're already in .gitignore
2. **Use strong passwords** - Generate secure passwords for MongoDB
3. **Rotate secrets regularly** - Change JWT secrets periodically
4. **Use environment-specific configs** - Different values for dev/staging/prod
5. **Validate environment variables** - Check required vars on startup
6. **JWT token validation** - Secure authentication middleware
7. **Role-based access control** - Proper authorization checks
8. **Input validation** - Server-side validation for all inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Set up your environment variables
4. Make your changes
5. Add tests if applicable
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 
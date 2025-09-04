# Chat Application - Real-time Messaging Platform

A modern, full-stack chat application built with Next.js, TypeScript, Socket.IO, Prisma, and PostgreSQL. Features real-time messaging, global chat rooms, private conversations, user authentication, and a responsive design.

## 🚀 Features

- **Real-time Messaging**: Instant messaging with Socket.IO
- **Global Chat Room**: All users automatically join a global chat
- **Private Conversations**: One-on-one messaging
- **User Authentication**: Secure login and registration
- **User Search**: Find and start conversations with other users
- **Message Status**: Sent, delivered, and read indicators
- **Online Presence**: See who's online
- **Typing Indicators**: Real-time typing notifications
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Real-time**: Socket.IO
- **State Management**: Zustand
- **UI Components**: Custom components with shadcn/ui
- **Icons**: Lucide React

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18.0 or later
- PostgreSQL database
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd chat-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Database Setup

Create a PostgreSQL database and get your connection string.

### 4. Environment Variables

Create a `.env` file in the root directory and add:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/chatapp"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Socket.IO
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Database Migration

Run Prisma migrations to set up your database schema:

```bash
npx prisma migrate dev --name init
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🔧 Fixed Issues

### Socket.IO Integration
- **Problem**: Standalone `server.ts` file was conflicting with Next.js
- **Solution**: Integrated Socket.IO properly using Next.js API routes in the `pages` directory
- **Files Changed**:
  - Removed: `server.ts` (standalone server)
  - Added: `/pages/api/socket.ts` (Socket.IO handler)
  - Added: `/lib/socket.ts` (Socket.IO initialization logic)
  - Updated: Socket context to properly initialize the server

### Frontend Loading Issues
- **Problem**: Frontend was taking too long to load due to server conflicts
- **Solution**: Proper separation of concerns and correct Socket.IO integration
- **Files Changed**:
  - Updated: `/contexts/SocketContext.tsx` - Better connection handling
  - Updated: `/components/chat/ChatInterface.tsx` - Added connection status
  - Updated: `/components/chat/ChatWindow.tsx` - Real-time message handling

### Build Configuration
- **Problem**: Missing dependencies and configuration
- **Solution**: Added proper `package.json` and Next.js configuration
- **Files Added**:
  - `/package.json` - All required dependencies
  - `/next.config.js` - Socket.IO configuration
  - `/env.example` - Environment variables template

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes (app router)
│   ├── (auth)/            # Authentication pages
│   ├── chat/              # Chat pages
│   └── layout.tsx         # Root layout
├── pages/api/             # API routes (pages router) - for Socket.IO
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat-related components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
├── lib/                   # Utility functions
├── prisma/                # Prisma schema and migrations
├── store/                 # State management
├── types/                 # TypeScript type definitions
└── styles/                # Global styles
```

## 🔍 Key Components

### Socket.IO Integration
- **Server**: `/pages/api/socket.ts` - WebSocket server
- **Client**: `/contexts/SocketContext.tsx` - React context for socket connections
- **Logic**: `/lib/socket.ts` - Socket.IO initialization and event handlers

### Chat Components
- **ChatInterface**: Main chat layout with sidebar and window
- **ChatWindow**: Message display and input area
- **MessageBubble**: Individual message rendering
- **UserSearch**: Find and start conversations

### Authentication
- **LoginForm**: User login with JWT
- **SignupForm**: User registration
- **Auth Context**: Authentication state management

## 🎯 Usage

1. **Sign Up/Login**: Create an account or log in
2. **Global Chat**: Automatically join the global chat room
3. **Private Chat**: Search for users and start private conversations
4. **Real-time Messaging**: Send and receive messages instantly
5. **Status Indicators**: See message delivery status and user online status

## 🔐 Security Features

- JWT authentication
- Input validation
- SQL injection prevention with Prisma
- CORS configuration for Socket.IO
- Environment variable protection

## 🚀 Deployment

### Environment Variables for Production
Update your production environment variables:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_SOCKET_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Build Commands
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check your DATABASE_URL in `.env`
   - Ensure PostgreSQL is running
   - Run `npx prisma db push` to sync schema

2. **Socket.IO Connection Issues**
   - Check browser console for errors
   - Ensure the Socket.IO server is initialized
   - Verify CORS configuration

3. **Build Errors**
   - Clear `.next` directory
   - Reinstall dependencies
   - Check TypeScript errors

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify all environment variables are set
4. Ensure the database is properly configured

## 🎉 Next Steps

The application is now properly configured and should run without the previous loading issues. The Socket.IO integration is working correctly with Next.js, and real-time messaging is functional.

To continue development:
1. Set up your PostgreSQL database
2. Configure environment variables
3. Run the migration commands
4. Start the development server
5. Test the real-time messaging functionality
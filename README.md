# 💬 Project Participants

- Fanuel Derbe (@FANU_D)
- Beshah Ashenafi (@Future_f0)
- Amanuel Takile (@wagesofsin_paid26)
- Gezahegn Birhanu (@bgdvlpr_men)

# 💬 Chat Application - Real-time Messaging Platform

A modern, full-stack chat application built with Next.js, TypeScript, Socket.IO, Prisma, and PostgreSQL. Features real-time messaging, global chat rooms, private conversations, user authentication, and a responsive design.

## ✨ Features
- Real-time Messaging: Instant messaging with Socket.IO
- Global Chat Room: All users automatically join a global chat
- Private Conversations: One-on-one messaging
- User Authentication: Secure login and registration
- User Search: Find and start conversations with other users
- Online Presence: See who's online
- Responsive Design: Works on desktop, tablet, and mobile
- Modern UI: Clean, intuitive interface with Tailwind CSS

## 🛠️ Tech Stack
- Frontend: Next.js 15.4.6, TypeScript, Tailwind CSS, CSS
- Backend: Next.js API Routes, Prisma ORM
- Database: PostgreSQL
- Real-time: Socket.IO
- State Management: Zustand
- UI Components: Custom components with shadcn/ui
- Icons: Lucide React

## 📋 Prerequisites
Before running this application, make sure you have:
- Node.js 18.0 or later
- PostgreSQL database
- npm or yarn package manager

## 🚀 Installation & Setup
1. Clone the repository
   ```
   git clone <your-repo-url>
   cd chat-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Database Setup
   Create a PostgreSQL database and get your connection string.

4. Environment Variables
   Create a `.env` file in the root directory and add:
   ```
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

5. Database Migration
   Run Prisma migrations to set up your database schema:
   ```
   npx prisma migrate dev --name init
   ```

6. Generate Prisma Client
   ```
   npx prisma generate
   ```

7. Start the Development Server
   ```
   npm run dev
   ```
   The application will be available at http://localhost:3000.

## 🔧 Fixed Issues

### Socket.IO Integration
- Problem: Standalone `server.ts` file was conflicting with Next.js
- Solution: Integrated Socket.IO properly using Next.js API routes in the `pages` directory
- Files Changed:
  - Removed: `server.ts` (standalone server)
  - Added: `/pages/api/socket.ts` (Socket.IO handler)
  - Added: `/lib/socket.ts` (Socket.IO initialization logic)
  - Updated: Socket context to properly initialize the server

### Frontend Loading Issues
- Problem: Frontend was taking too long to load due to server conflicts
- Solution: Proper separation of concerns and correct Socket.IO integration
- Files Changed:
  - Updated: `/contexts/SocketContext.tsx` - Better connection handling
  - Updated: `/components/chat/ChatInterface.tsx` - Added connection status
  - Updated: `/components/chat/ChatWindow.tsx` - Real-time message handling

### Build Configuration
- Problem: Missing dependencies and configuration
- Solution: Added proper `package.json` and Next.js configuration
- Files Added:
  - `/package.json` - All required dependencies
  - `/next.config.js` - Socket.IO configuration
  - `/.env` - Environment variables

## 📁 Project Structure
```
Chat_App
├── app
│   ├── (auth)
│   │   ├── login
│   │   │   └── page.tsx
│   │   └── signup
│   │       └── page.tsx
│   ├── about
│   │   └── page.tsx
│   ├── chat
│   │   ├── [chatId]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── profile
│   │   └── page.tsx
│   ├── api
│   │   ├── auth
│   │   │   ├── login
│   │   │   │   └── route.ts
│   │   │   ├── logout
│   │   │   │   └── route.ts
│   │   │   ├── me
│   │   │   │   └── route.ts
│   │   │   ├── register
│   │   │   │   └── route.ts
│   │   │   └── status
│   │   │       └── route.ts
│   │   ├── conversations
│   │   │   ├── [conversationId]
│   │   │   │   ├── messages
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── send
│   │   │   │   │       └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── direct
│   │   │       └── route.ts
│   │   └── users
│   │       └── search
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── favicon.ico
│   ├── page.module.css
│   └── api
├── components
│   ├── auth
│   │   ├── AuthForm.tsx
│   │   ├── LoginForm.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupForm.tsx
│   │   └── SignupPage.tsx
│   ├── chat
│   │   ├── ChatComponents.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── ChatList.tsx
│   │   ├── ChatListItem.tsx
│   │   ├── ChatSidebar.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── MobileNavigation.tsx
│   │   ├── MessageBubble.tsx
│   │   └── UserProfile.tsx
│   ├── HomePage.tsx
│   ├── Chat.tsx
│   ├── Auth.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── chart.tsx
│       ├── calendar.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── imageWithFallback.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── resizable.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sidebar.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── tabs.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.ts
│       ├── utils.ts
│       └── skeleton.tsx
├── contexts
│   ├── AuthContext.tsx
│   └── SocketContext.tsx
├── hooks
│   └── useDebounce.ts
├── lib
│   ├── auth.ts
│   ├── prisma.ts
│   ├── socket.ts
│   └── utils.ts
├── pages
│   └── api
│       └── socket.ts
├── prisma
│   ├── migrations
│   └── schema.prisma
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── store
│   └── chatStore.ts
├── .env
├── .gitignore
├── eslint.config.mjs
├── jest.config.js
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
└── tailwind.config.js
```

## 🔑 Key Components

### Socket.IO Integration
- Server: `/pages/api/socket.ts` - WebSocket server
- Client: `/contexts/SocketContext.tsx` - React context for socket connections
- Logic: `/lib/socket.ts` - Socket.IO initialization and event handlers

### Chat Components
- ChatInterface: Main chat layout with sidebar and window
- ChatWindow: Message display and input area
- MessageBubble: Individual message rendering
- UserSearch: Find and start conversations

### Authentication
- LoginForm: User login with JWT
- SignupForm: User registration
- Auth Context: Authentication state management

## 📲 Usage
- Sign Up/Login: Create an account or log in
- Global Chat: Automatically join the global chat room
- Private Chat: Search for users and start private conversations
- Real-time Messaging: Send and receive messages instantly
- Status Indicators: See message delivery status and user online status

## 🔒 Security Features
- JWT authentication
- Input validation
- SQL injection prevention with Prisma
- CORS configuration for Socket.IO
- Environment variable protection

## 🚀 Deployment

### Environment Variables for Production
Update your production environment variables:
```
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_SOCKET_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Build Commands
```
npm run build
npm start
```

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Issues
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Run `npx prisma db push` to sync schema

#### Socket.IO Connection Issues
- Check browser console for errors
- Ensure the Socket.IO server is initialized
- Verify CORS configuration

#### Build Errors
- Clear `.next` directory
- Reinstall dependencies
- Check TypeScript errors

### Getting Help
If you encounter issues:
- Check the browser console for errors
- Check the terminal for server errors
- Verify all environment variables are set
- Ensure the database is properly configured

## 📈 Next Steps
The application is now properly configured and should run without the previous loading issues. The Socket.IO integration is working correctly with Next.js, and real-time messaging is functional.

To continue development:
1. Set up your PostgreSQL database
2. Configure environment variables
3. Run the migration commands
4. Start the development server
5. Test the real-time messaging functionality

## 📹 Demo Video
**Watch the project demo video here: https://drive.google.com/file/d/1Skx18H_91m_rO5Cz3U-Ti709xQt1RRuv/view?usp=sharing**  
**Try the live demo here: https://chat-app-final-eji4.vercel.app/**

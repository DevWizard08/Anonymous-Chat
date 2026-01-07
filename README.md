# Anonymous Random Chat Application

A full-stack anonymous one-to-one real-time chat application where users are randomly matched with strangers. Features live messaging, skip/end chat, automatic re-matching, Redis-backed matchmaking, and proper disconnect handling.

## 🔗 Live Demo

- **Frontend**: https://anonymous-chat-sigma-pearl.vercel.app/
- **Backend**: https://anonymous-chat-j8iu.onrender.com

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Chat Flow](#chat-flow)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [License](#license)

## 🎯 Overview

This application simulates platforms like Omegle/Chatroulette, where:

- Users chat anonymously without authentication
- Only one active chat is allowed per user at a time
- Users can skip to find a new partner instantly
- Users can end a chat and stay idle
- The system gracefully handles disconnects and notifies partners

## ✨ Features

- **Anonymous Connection**: No registration or login required
- **Random Matchmaking**: Redis-backed intelligent pairing system
- **Real-time Messaging**: Instant message delivery via WebSockets
- **Skip Chat**: Automatically find a new partner
- **End Chat**: Exit conversation and go idle
- **Disconnect Handling**: Partner notification on unexpected disconnects
- **Message Validation**: Input sanitization and rate limiting
- **Session Tracking**: Persistent chat session metadata in PostgreSQL

## 🏗️ Architecture

```
┌─────────────────────────┐
│   Frontend (React)      │
│   TypeScript + Vite     │
└───────────┬─────────────┘
            │ Socket.IO (WebSockets)
            ▼
┌─────────────────────────┐
│   Backend (Node.js)     │
│   TypeScript + Express  │
└───────┬─────────┬───────┘
        │         │
        ▼         ▼
┌─────────┐ ┌──────────────┐
│  Redis  │ │  PostgreSQL  │
│ (Upstash)│ │   (Neon)     │
│ Matching│ │   Sessions   │
└─────────┘ └──────────────┘
```

**Data Flow:**
1. User connects via Socket.IO
2. Matchmaking logic queries Redis for available users
3. Matched pairs create a session in PostgreSQL
4. Messages are transmitted in real-time (not persisted)
5. Session metadata is updated on chat end

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Socket.IO Client | WebSocket communication |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| TypeScript | Type safety |
| Socket.IO | Real-time bidirectional communication |
| Prisma ORM | Database queries & migrations |
| Express | HTTP server |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Redis (Upstash) | Matchmaking queue & active chat state |
| PostgreSQL (Neon) | Chat session metadata persistence |
| Vercel | Frontend hosting |
| Render | Backend hosting |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Redis instance (or Upstash account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/anonymous-chat.git
   cd anonymous-chat
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
   REDIS_URL=rediss://your-upstash-url
   ```

   Run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

   Start server:
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

   Create `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```

   Start development server:
   ```bash
   npm run dev
   ```

4. **Test the Application**
   - Open http://localhost:5173 in two browser tabs
   - Click "Start Chat" in both tabs
   - Start messaging! 🎉

## 📁 Project Structure

```
anonymous-chat/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/                # Environment & Redis config
│   │   ├── db/                    # Prisma client
│   │   ├── socket/                # Socket.IO event handlers
│   │   ├── utils/                 # Validators & rate limiter
│   │   ├── types/                 # TypeScript types
│   │   ├── app.ts                 # Express app setup
│   │   └── index.ts               # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom hooks (socket)
│   │   ├── config/                # Constants
│   │   ├── types/                 # TypeScript types
│   │   ├── App.tsx                # Main app component
│   │   └── main.tsx               # Entry point
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 🔄 Chat Flow

### 1. **Search for Partner**
```
User clicks "Start Chat"
   ↓
Socket emits "search" event
   ↓
Backend adds user to Redis waiting queue
   ↓
Attempts to match with another waiting user
```

### 2. **Match Found**
```
Two users in queue
   ↓
Create ChatSession in PostgreSQL
   ↓
Store active chat mapping in Redis
   ↓
Emit "matched" event to both users
   ↓
Users can exchange messages
```

### 3. **Skip Chat**
```
User clicks "Skip"
   ↓
Socket emits "skip" event
   ↓
End current chat session
   ↓
Notify partner with "partner_left"
   ↓
Automatically re-add user to queue
   ↓
Attempt immediate re-match
```

### 4. **End Chat**
```
User clicks "End Chat"
   ↓
Socket emits "end_chat" event
   ↓
End current chat session
   ↓
Notify partner with "partner_left"
   ↓
User goes to IDLE state
   ↓
Must manually search to chat again
```

### 5. **Disconnect Handling**
```
User closes tab/loses connection
   ↓
Socket "disconnect" event fired
   ↓
Remove user from Redis queue
   ↓
Clean up active chat state
   ↓
Notify partner with "partner_left"
```

## 📡 API Documentation

### Socket.IO Events

#### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `search` | None | Request to find a chat partner |
| `message` | `{ text: string }` | Send message to current partner |
| `skip` | None | End chat and auto re-match |
| `end_chat` | None | End chat and go idle |

#### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `matched` | `{ partnerId: string }` | Successfully paired with someone |
| `message` | `{ text: string, timestamp: number }` | Incoming message from partner |
| `partner_left` | None | Partner disconnected or ended chat |
| `error` | `{ message: string }` | Error notification |

### Database Schema

#### ChatSession Table
```prisma
model ChatSession {
  id        String    @id @default(uuid())
  userA     String    // First user socket ID
  userB     String    // Second user socket ID
  startedAt DateTime  @default(now())
  endedAt   DateTime? // Null while chat is active
}
```

### Redis Data Structure

```
Waiting Queue:
  Key: "waiting_users"
  Type: Set
  Value: Socket IDs of users searching

Active Chats:
  Key: "chat:{socketId}"
  Type: String
  Value: Partner's socket ID

Active Sessions:
  Key: "session:{socketId}"
  Type: String
  Value: PostgreSQL session ID
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect repository to Vercel
2. Set environment variables:
   ```
   VITE_BACKEND_URL=https://anonymous-chat-j8iu.onrender.com
   ```
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Root directory: `frontend`

### Backend (Render)

1. Create new Web Service
2. Set environment variables:
   ```
   DATABASE_URL=<your-postgresql-url>
   REDIS_URL=<your-redis-url>
   ```
3. Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
4. Start command: `npm start`

## ⚠️ Known Limitations

- **Connection Loss**: Active WebSocket connections are lost on backend restart. Users must reconnect and search again.
- **Message Persistence**: Chat messages are not persisted by design. Only session metadata is stored.
- **Transient State**: Redis is used only for temporary state, not long-term storage.
- **Single Region**: No multi-region support currently implemented.
- **Rate Limiting**: Basic rate limiting is implemented but may need tuning for production scale.

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting on message sending
- SQL injection prevention via Prisma ORM
- No personal data collection
- WebSocket connection validation

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👤 Author

**Sanjeev Kumar**  
Backend / Full Stack Developer

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with  using React, Node.js, Socket.IO, Redis, and PostgreSQL**
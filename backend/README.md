# Backend – Anonymous Chat System

This is the backend service responsible for matchmaking, real-time messaging, and session lifecycle management.

## 📁 Folder Structure

```
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/          # constants & env handling
│   ├── db/              # Prisma client
│   ├── socket/          # Socket.IO logic
│   ├── utils/           # validators & rate limiter
│   ├── types/           # TypeScript types
│   ├── app.ts
│   └── index.ts
├── .env.example
├── package.json
└── tsconfig.json
```

## ⚙️ Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```

## 🛠 Setup & Run (Backend)

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Backend will run on: **http://localhost:3000**

## 🔄 Chat Lifecycle

1. User searches for a chat
2. Two users are randomly matched
3. Chat session is created in DB
4. Messages are exchanged in real-time
5. On skip/disconnect:
   - Partner is notified
   - Session `endedAt` is updated

## 🧠 Design Decisions

- **In-memory maps** for active chats (speed)
- **SQL persistence** for chat sessions (reliability)
- **Single Socket.IO server** for simplicity

## 🧪 Database Schema

Only chat session metadata is stored:

### ChatSession
- `id` - Unique identifier
- `userA` - First user socket ID
- `userB` - Second user socket ID
- `startedAt` - Session start timestamp
- `endedAt` - Session end timestamp (nullable)

## 🔌 Socket.IO Events

### Emitted by Client
- `search` - User wants to find a chat partner
- `message` - Send a message to partner
- `skip` - End current chat and search for new partner

### Emitted by Server
- `matched` - Successfully paired with a partner
- `message` - Receive a message from partner
- `partner_left` - Partner disconnected or skipped
- `error` - Error message

## 📦 Dependencies

```json
{
  "express": "^4.x",
  "socket.io": "^4.x",
  "@prisma/client": "^5.x",
  "dotenv": "^16.x"
}
```

## 🚀 Deployment

The backend is deployed on **Render**. Make sure to:

1. Set environment variables in Render dashboard
2. Run `npx prisma migrate deploy` in build command
3. Configure start command: `npm start`

## 🔒 Security Features

- Message validation
- Rate limiting
- Input sanitization
- SQL injection prevention (via Prisma)

## 📝 API Documentation

This is a WebSocket-based application. No REST API endpoints are exposed.

---

**Note**: Messages are not persisted in the database - only chat session metadata is stored for analytics purposes.
# Anonymous Random Chat Application

A full-stack anonymous one-to-one real-time chat application where users are randomly matched with strangers. The system supports live messaging, skip/end chat, automatic re-matching, and proper disconnect handling.

## 🔗 Live URLs

- **Frontend**: https://anonymous-chat-sigma-pearl.vercel.app/
- **Backend**:  https://anonymous-chat-j8iu.onrender.com

## 🧠 Use Case

This application simulates platforms like Omegle / Chatroulette, where:

- Users chat anonymously
- Only one active chat is allowed at a time
- Users can skip or end a chat and find a new partner
- The system gracefully handles disconnects

## 🏗️ Architecture Overview

```
Frontend (React + TypeScript)
           |
           | Socket.IO (WebSockets)
           |
Backend (Node.js + TypeScript)
           |
           | Prisma ORM
           |
   PostgreSQL (Neon)
```

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Socket.IO Client

### Backend
- Node.js
- TypeScript
- Socket.IO
- Prisma ORM

### Database
- PostgreSQL (Neon – managed cloud DB)

### Deployment
- Frontend: Vercel
- Backend: Render

## 📁 Repository Structure

```
anonymous-chat/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── README.md
│   └── package.json
├── frontend/
│   ├── src/
│   ├── README.md
│   └── package.json
└── README.md
```

## 🚀 How to Run Locally

1. Clone the repository
2. Setup backend (see `backend/README.md`)
3. Setup frontend (see `frontend/README.md`)
4. Open two browser tabs and start chatting 🎉

## ✅ Features Implemented

- Anonymous user connection
- Random matchmaking
- One active chat per user
- Real-time messaging
- Skip / end chat with re-match
- Partner disconnect notification
- Message validation & rate limiting
- Persistent chat session tracking (SQL)

## ⚠️ Known Limitations

- Active chats are stored in memory (reset on server restart)
- Messages are not persisted (only chat sessions are stored)

## 📄 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 👤 Author

**Sanjeev Kumar**  
Backend / Full Stack Developer

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

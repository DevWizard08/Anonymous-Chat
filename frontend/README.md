# Frontend – Anonymous Chat UI

This is the frontend UI for the anonymous chat application built with React, TypeScript, and Vite.

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── components/      # UI components
│   ├── hooks/           # Socket hook
│   ├── config/          # constants
│   ├── types/           # TS types
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
└── vite.config.ts
```

## ⚙️ Environment Variables

Create a `.env` file inside `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

For production:

```env
VITE_BACKEND_URL=https://your-backend.onrender.com
```

## 🛠 Setup & Run (Frontend)

```bash
cd frontend
npm install
npm run dev
```

App runs on: **http://localhost:5173**

## 🎯 UI States

The application has three main states:

1. **IDLE** – User not in chat (showing start button)
2. **SEARCHING** – Looking for partner (showing loading state)
3. **CONNECTED** – Chatting with partner (showing chat interface)

## 🔄 Socket Events Used

### Emitted to Server
- `search` - Request to find a chat partner
- `message` - Send message to current partner
- `skip` - End chat and find new partner

### Received from Server
- `matched` - Successfully paired with someone
- `message` - Incoming message from partner
- `partner_left` - Partner disconnected or skipped
- `error` - Error notification

## 🧠 Design Philosophy

- Minimal UI (functionality > design)
- Strong TypeScript typing
- Single socket connection per user
- Component-based architecture

## 🎨 Components Structure

```
App.tsx
  ├── ChatInterface
  │   ├── MessageList
  │   ├── MessageInput
  │   └── ChatControls
  └── WelcomeScreen
```

## 📦 Dependencies

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "socket.io-client": "^4.x",
  "typescript": "^5.x",
  "vite": "^5.x"
}
```

## 🚀 Deployment

The frontend is deployed on **Vercel**. Make sure to:

1. Set `VITE_BACKEND_URL` in Vercel environment variables
2. Build command: `npm run build`
3. Output directory: `dist`

## 🔧 Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## 🧪 Testing Locally

To test the full application:

1. Start the backend server
2. Start the frontend dev server
3. Open two browser tabs/windows
4. Click "Start Chat" in both tabs
5. They should be matched and able to message each other

## 🎨 Customization

You can customize the UI by modifying:

- `src/components/` - React components
- `src/styles/` - CSS/styling files
- `src/config/` - Configuration constants

## 🐛 Troubleshooting

### Connection Issues
- Check that `VITE_BACKEND_URL` is set correctly
- Ensure backend server is running
- Check browser console for errors

### Not Getting Matched
- You need at least 2 users searching simultaneously
- Try opening another browser tab/window

---

**Note**: This is a minimal viable product focused on functionality. UI/UX improvements can be added based on requirements.
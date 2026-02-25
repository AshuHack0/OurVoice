# 🚀 Quick Start Guide - OurVoice with Backend

Complete guide to run OurVoice with the integrated backend.

---

## ⚡ Quick Start (2 Terminals)

### Terminal 1: Backend Server

```bash
cd /Users/ashutosh/codes/ourVoiceBackend
npm run dev
```

Wait for: `✅ MongoDB Connected` and `🚀 Server is running`

### Terminal 2: React Native App

```bash
cd /Users/ashutosh/codes/OurVoice
npm start
```

Then press `i` for iOS or `a` for Android

---

## 📋 First Time Setup

### 1. Backend Setup (One Time)

```bash
# Navigate to backend
cd /Users/ashutosh/codes/ourVoiceBackend

# Install dependencies
npm install

# Start MongoDB (macOS)
brew services start mongodb-community

# Seed database with sample data
npm run seed
```

### 2. App Setup (Already Done)

```bash
# Navigate to app
cd /Users/ashutosh/codes/OurVoice

# Dependencies already installed
# Axios already added
```

---

## 🎯 Testing the Integration

### 1. Verify Backend is Running

```bash
# In a new terminal
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "OurVoice API is running",
  ...
}
```

### 2. Test API Endpoints

```bash
# Get today's questions
curl http://localhost:5000/api/v1/questions/daily

# Get polls
curl http://localhost:5000/api/v1/polls
```

### 3. Test in App

1. **Daily Questions Tab**
   - Should load questions from backend
   - Submit a response
   - Should see success modal

2. **Community Tab**
   - Tap a question to expand
   - Should see responses from backend

3. **Polls Tab**
   - Should load polls from backend
   - Vote on a poll
   - Should see updated results

---

## 🔧 Configuration

### API URLs (Already Configured)

**iOS Simulator:** `http://localhost:5000/api/v1`  
**Android Emulator:** `http://10.0.2.2:5000/api/v1`

### For Physical Device

1. Find your computer's IP:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. Update `services/api.ts` line 18:
   ```typescript
   default: 'http://YOUR_IP:5000/api/v1',
   ```

3. Update backend CORS in `ourVoiceBackend/.env`:
   ```bash
   CORS_ORIGIN=http://localhost:8081,exp://YOUR_IP:8081
   ```

4. Restart backend

---

## 🐛 Common Issues

### Backend Won't Start

**Error:** "MongoDB connection failed"

**Solution:**
```bash
# Start MongoDB
brew services start mongodb-community

# Or use MongoDB Atlas
# Update MONGODB_URI in ourVoiceBackend/.env
```

### App Can't Connect

**Error:** "Network request failed"

**Solutions:**
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check if you're using physical device (need IP address)
3. Restart Metro bundler: `npm start -- --reset-cache`

### No Data Showing

**Problem:** Empty questions or polls

**Solution:**
```bash
# Seed the database
cd /Users/ashutosh/codes/ourVoiceBackend
npm run seed
```

---

## 📊 What's Integrated

### ✅ Daily Questions
- Fetches from: `GET /api/v1/questions/daily`
- Submits to: `POST /api/v1/responses`
- Loading states ✓
- Error handling ✓

### ✅ Community Responses
- Fetches from: `GET /api/v1/responses/:questionId`
- Lazy loading ✓
- Real-time data ✓

### ✅ Polls
- Fetches from: `GET /api/v1/polls`
- Votes to: `POST /api/v1/polls/:id/vote`
- Duplicate prevention ✓
- Live results ✓

---

## 🎨 Features

### Loading States
- Spinners while fetching data
- Disabled buttons while submitting
- Smooth transitions

### Error Handling
- Network error messages
- Retry buttons
- User-friendly alerts

### Real-time Updates
- Data persists in MongoDB
- Shared across all users
- Vote counts update live

---

## 📁 Project Structure

```
/Users/ashutosh/codes/
├── ourVoiceBackend/          # Node.js API
│   ├── src/
│   │   ├── models/           # MongoDB schemas
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API endpoints
│   │   └── server.js         # Entry point
│   ├── .env                  # Configuration
│   └── package.json
│
└── OurVoice/                 # React Native App
    ├── app/(tabs)/
    │   ├── index.tsx         # Daily Questions ✓
    │   ├── community.tsx     # Community ✓
    │   └── polls.tsx         # Polls ✓
    ├── services/
    │   └── api.ts            # API service ✓
    └── package.json
```

---

## 🔄 Development Workflow

### Daily Development

1. **Start Backend**
   ```bash
   cd ourVoiceBackend && npm run dev
   ```

2. **Start App**
   ```bash
   cd OurVoice && npm start
   ```

3. **Make Changes**
   - Backend: Auto-reloads with nodemon
   - App: Hot reloads with Metro

4. **Test Changes**
   - Use app on simulator/device
   - Check backend logs
   - Use Postman for API testing

### Stopping Services

```bash
# Stop backend: Ctrl+C in backend terminal
# Stop app: Ctrl+C in app terminal
# Stop MongoDB: brew services stop mongodb-community
```

---

## 🧪 Testing Checklist

### Backend
- [ ] `npm run dev` starts without errors
- [ ] MongoDB connected
- [ ] Health check works
- [ ] Questions endpoint returns data
- [ ] Polls endpoint returns data

### App
- [ ] `npm start` runs without errors
- [ ] App loads on simulator/device
- [ ] Questions load from API
- [ ] Can submit response
- [ ] Polls load from API
- [ ] Can vote on poll
- [ ] Community tab shows responses

---

## 📚 Documentation

- **Backend API:** `ourVoiceBackend/API_DOCUMENTATION.md`
- **Backend Setup:** `ourVoiceBackend/START_HERE.md`
- **Integration Guide:** `OurVoice/BACKEND_INTEGRATION.md`
- **Deployment:** `ourVoiceBackend/DEPLOYMENT.md`

---

## 🎉 You're Ready!

Everything is set up and integrated. Just run:

1. **Terminal 1:** `cd ourVoiceBackend && npm run dev`
2. **Terminal 2:** `cd OurVoice && npm start`
3. Press `i` or `a` to launch

Your app is now connected to a real backend with MongoDB! 🚀

---

**Need Help?** Check `BACKEND_INTEGRATION.md` for detailed troubleshooting.

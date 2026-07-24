# SkillSync — Peer-to-Peer Skill Swapping Platform

A MERN starter scaffold for a platform where people trade skills instead of money:
list what you can teach, list what you want to learn, and get matched with people
whose needs mirror yours.

This is a working, runnable foundation — not a finished product. Auth, the core
matching engine, sessions, chat, reviews/badges, and a basic admin panel are all
implemented end-to-end. Polish, edge cases, and the bonus features (forum,
achievements, etc.) are left for you to build on top.

## Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT auth, Socket.io for real-time chat
- **Frontend**: React 18, Vite, React Router, Axios, Socket.io-client

## Project structure

```
skillsync/
├── backend/
│   ├── config/db.js            Mongo connection
│   ├── models/                 User, Match, Session, Review, Message, Report
│   ├── middleware/              auth (JWT), error handler
│   ├── controllers/             business logic per resource
│   ├── routes/                  Express routers
│   ├── server.js                app entry, Socket.io wiring
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/client.js        Axios instance with auth interceptor
    │   ├── context/AuthContext  login/register/session state
    │   ├── components/          NavBar, ProtectedRoute
    │   ├── pages/                Login, Register, Profile, Explore, Matches, MatchDetail, Admin
    │   └── styles/global.css    design tokens (palette, type, components)
    └── .env.example
```

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env      # then edit MONGO_URI and JWT_SECRET
npm install
npm run dev                # nodemon, restarts on change
```

Requires a MongoDB instance — either local (`mongodb://127.0.0.1:27017/skillsync`)
or a free Atlas cluster. Update `MONGO_URI` in `.env` accordingly.

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env       # defaults point at localhost:5000, fine for local dev
npm install
npm run dev
```

Runs on `http://localhost:5173`. Vite is configured to proxy `/api` to the backend.

### 3. Try it out

1. Register two different accounts (open a second browser or incognito window).
2. On each profile, add at least one skill to teach and one to learn — for a match
   to appear, the two accounts need to want to learn what the other can teach
   (and vice versa).
3. Go to **Explore** — the matching logic (`backend/controllers/matchController.js`)
   compares the arrays directly, no AI involved, and only shows a match when both
   sides' needs align.
4. Send a swap request, accept it from the other account, then chat, schedule a
   session, and leave a review to see badges (`Peer Rated`, `Verified Teacher`) unlock.
5. Promote a user to admin by setting `role: "admin"` on their User document
   directly in MongoDB, then visit **/admin**.

## What's implemented

- Email/password auth (JWT) — Google OAuth is not wired up yet, swap in
  `passport-google-oauth20` or similar when ready
- Profile: skills to teach (with level + optional proof link), skills to learn,
  weekly availability slots, city/timezone
- Mutual matching (non-AI), match request/accept/reject/complete flow
- Sessions: scheduling, meeting link, notes, milestones, shared resource links
- In-app chat over Socket.io, gated to open only after a match is accepted
- Reviews (1–5 stars) with automatic rating rollup and badge awarding
- Abuse reporting
- Admin panel: user list + block/unblock, skill verification, report queue,
  basic analytics (user/match/session counts, top taught skills)

## What's next (from the original bonus list)

- Skill progress tracker UI (data model supports it via `Session.milestones`)
- Community forum
- Achievements system beyond the two seeded badges
- Real Zoom/Google Meet API integration (currently just a plain URL field)
- File upload storage (S3 or similar) for chat attachments and proof documents —
  currently the schema expects a URL, no upload endpoint is wired up yet
- Email notifications / session reminders (`Session.reminderSent` flag is there,
  no cron job or mailer yet)

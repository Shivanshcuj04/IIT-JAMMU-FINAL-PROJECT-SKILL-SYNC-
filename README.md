# 💡 SkillSync — Peer-to-Peer Skill Swapping Platform

A platform where users list skills they can **teach** and skills they want to **learn**, then get matched with others for peer-to-peer learning swaps. Think of it like barter — but for learning.

---

## 🚀 Live Demo

**Try it here:** [https://iit-jammu-final-project-skill-sync-lovat.vercel.app/](https://iit-jammu-final-project-skill-sync-lovat.vercel.app/)

---

## 📑 Table of Contents

- [Problem](#-problem)
- [Solution](#-solution)
- [Tech Stack](#️-tech-stack)
- [Key Features](#-key-features)
- [User Flow](#-user-flow-visual-style)
- [Bonus Features](#-bonus-features-to-add)
- [Use Cases](#-use-cases)
- [Project Structure](#-project-structure)
- [Setup & Installation](#️-setup--installation)

---

## 🚩 Problem

People want to learn valuable skills but can't afford courses. At the same time, many know something useful they could teach — if only they could exchange skills directly.

## 🎯 Solution

A platform where users can list skills they can teach and skills they want to learn, then match with others for peer-to-peer learning swaps.

## 🖥️ Tech Stack

| Layer | Tech |
|---|---|
| Database | MongoDB — Users, Skills, Matches, Sessions, Reviews |
| Backend | Express + Node.js — Auth, Matching logic (non-AI), Session handling |
| Frontend | React.js — Skill dashboard, Match explorer, Chat, Profile system |

## 🔑 Key Features

### 👤 User Profile
- Login/Register (Google OAuth or email)
- Set:
  - Skills you can teach (with experience level, optional proof)
  - Skills you want to learn
  - Availability slots
  - City/timezone (for better matches)
- Profile badge system:
  - "Verified Teacher" (after X sessions)
  - "Peer Rated" (positive reviews)

### 🔍 Explore & Match
- See a list of available swaps:
  - "You can teach A, they want to learn A"
  - "They can teach B, you want to learn B"
- Mutual match logic (not AI) — only shows when both needs align
- Match requests with status: `Pending`, `Accepted`, `Completed`

### 🗓️ Sessions
- Request 1:1 sessions
- Schedule by selecting from each other's availability
- Built-in video call link (Zoom/Google Meet integration or placeholder link)
- Track progress (notes, resources, milestones)
- Session reminders (email or in-app)

### 💬 In-app Chat
- Chat with matched users — opens only after match is accepted
- File sharing: docs, PDFs, images

### 🏅 Verification & Reviews
- Peer reviews after session (1–5 stars, comments)
- Admin skill verification (optional test or document upload)
- Complaints or abuse reporting

### 🛡️ Admin Panel
- Manage users, block if reported multiple times
- Verify skills (optional)
- Monitor active sessions, system health
- Analytics dashboard (matches made, top skills, user growth)

## 🔄 User Flow (Visual Style)

**👤 User Journey**
```
[Home Page]
   ↓
[Login/Register]
   ↓
[Create Profile: Skills to Teach + Learn]
   ↓
[View Matches]
   ↓
[Send Match Request]
   ↓
[Match Accepted]
   ↓
[Chat Opens + Schedule Session]
   ↓
[Attend Session]
   ↓
[Leave Review + Mark as Completed]
   ↓
[Track Progress → Next Match]
```

**🛡️ Admin Journey**
```
[Admin Login]
   ↓
[View New User Registrations]
   ↓
[Optional Skill Verification (Manual)]
   ↓
[View Sessions, Monitor Reports]
   ↓
[Handle Abuse Reports or Review Disputes]
```

## 📈 Bonus Features to Add

| Feature | Description |
|---|---|
| Skill Progress Tracker | Users can track what they've learned from sessions |
| Community Forum | Ask general doubts, discuss progress |
| Achievements System | "Completed 5 swaps", "Taught 10 learners", etc. |
| Skill Category Tags | Easier filtering (Tech, Music, Art, Language) |
| Swap History Badge | Builds user trust and community standing |
| Shared Notes / Resources Page | Each session has a shared resource vault |

## ✅ Use Cases

- A student teaches "Basics of Python" in exchange for "Beginner Guitar lessons"
- A designer offers "Logo Design" tutorials in return for "Excel Basics"
- A freelancer teaches "Freelance Portfolio Setup" in exchange for "Spoken English practice"

## 📁 Project Structure

```
IIT-JAMMU-FINAL-PROJECT-SKILL-SYNC-/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── matchController.js
│   │   ├── messageController.js
│   │   ├── reviewController.js
│   │   ├── sessionController.js
│   │   ├── supportController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── Match.js
│   │   ├── Message.js
│   │   ├── Report.js
│   │   ├── Review.js
│   │   ├── Session.js
│   │   ├── SupportTicket.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── sessionRoutes.js
│   │   ├── support.js
│   │   └── userRoutes.js
│   │
│   ├── utils/
│   │   └── matchingLogic.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── admin.js
│   │   │   ├── axios.js
│   │   │   ├── reviews.js
│   │   │   ├── sessions.js
│   │   │   └── support.js
│   │   │
│   │   ├── components/
│   │   │   ├── AvatarMenu.jsx
│   │   │   ├── FAQAccordion.jsx
│   │   │   ├── FloatingSupportButton.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PageTransition.jsx
│   │   │   ├── PasswordField.jsx
│   │   │   ├── ScrollProgress.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── SkillCard.jsx
│   │   │   └── SupportContactForm.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── data/
│   │   │   └── faqs.js
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MatchRequests.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Sessions.jsx
│   │   │   └── Support.jsx
│   │   │
│   │   ├── utils/
│   │   │   └── passwordStrength.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── vercel.json
```

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Shivanshcuj04/IIT-JAMMU-FINAL-PROJECT-SKILL-SYNC-.git
cd IIT-JAMMU-FINAL-PROJECT-SKILL-SYNC-
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Run the backend:

```bash
node server.js
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app

Visit the [live demo](https://iit-jammu-final-project-skill-sync-lovat.vercel.app/), or your local dev server at `http://localhost:5173`.

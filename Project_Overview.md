# AI Environmental Impact Analyzer - Project Overview

## 🌍 Introduction
The **AI Environmental Impact Analyzer** is a comprehensive full-stack platform designed to help users evaluate the environmental footprint of their daily habits and products. By leveraging the power of **Google Gemini AI**, it provides real-time analysis, sustainability scoring, and actionable eco-friendly recommendations.

---

## 🛠 Technology Stack

### Frontend (Client-Side)
- **Framework:** Next.js 16 (App Router) & React 19
- **Styling:** Tailwind CSS (Utility-first design)
- **Animations:** Framer Motion (Premium micro-interactions)
- **Icons:** Lucide React
- **State/Auth:** React Context API & js-cookie

### Backend (Server-Side)
- **Runtime:** Node.js & Express.js 5.2
- **Database:** MongoDB & Mongoose 9.3 (NoSQL storage)
- **AI Integration:** @google/generative-ai (Gemini API)
- **Security:** JWT (JSON Web Tokens) & Bcryptjs (Password hashing)


---

## 🔌 API Architecture

### Internal API Endpoints
The backend provides a structured RESTful API accessible via `/api`:

| Category | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | `POST /api/auth/login` | User login and JWT issuance |
| **Auth** | `POST /api/auth/register` | New user account creation |
| **Analysis**| `POST /api/analyze` | AI-powered footprint assessment |
| **Analysis**| `GET /api/history` | User's personal analysis history |
| **Learning**| `GET /api/learning/articles` | Educational content retrieval |
| **Learning**| `GET /api/learning/quiz` | Environmental awareness quizzes |
| **Admin** | `GET /api/admin/users` | Platform user management |

### External Integrations
- **Google Gemini API:** The core "brain" of the application, used to process natural language descriptions and return structured environmental data.

---

## 🚀 Setup & Installation

To run this project locally, follow these steps:

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance or Atlas URI)
- **Gemini API Key** (Obtained from Google AI Studio)

### 2. Backend Setup
1. Navigate to the `backend/` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the server: `npm run dev`

### 3. Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`
3. Create a `.env.local` file and add:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Start the development server: `npm run dev`

---

<!-- ## 👥 The Team
- **Iqra Nazim:** Lead Frontend Developer
- **Ezzah Khan:** Backend Developer
- **Amina Hassan:** Design & Documentation -->

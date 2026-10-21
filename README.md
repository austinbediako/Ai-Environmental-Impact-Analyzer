# 🌿 EcoAnalyzer: AI-Powered Environmental Impact Platform

**EcoAnalyzer** is a cutting-edge environmental transparency platform that harnesses the power of **Google Gemini Pro AI** to decode the carbon cost of consumer goods and lifestyle choices. We combine sophisticated data analysis with a community-driven knowledge base to empower individuals in the fight against climate change.

---

## 🚀 Key Features

- **🔍 AI Impact Analysis**: Real-time analysis of product manufacturing, transportation, and material lifecycle using Google Gemini Pro.
- **📚 Community Articles**: A robust P2P knowledge platform where users can learn and contribute peer-reviewed environmental research.
- **🛡️ Admin Moderation**: Structured workflow for approving, updating, and deleting community content to ensure scientific accuracy.
- **🏆 Gamified Sustainability**: Engage in Eco Quizzes, earn badges, and climb the global leaderboards.
- **📊 Carbon Tracking**: Personalized history of analyzed items to track your journey toward a smaller footprint.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **AI**: [Google Gemini Pro API](https://ai.google.dev/)

---

## 📂 Repository Structure

```
.
├── frontend/           # Next.js Application (Vercel)
│   ├── src/app/        # App Router pages
│   ├── src/components/ # Shared UI components
│   └── public/         # Static assets & Branding
├── backend/            # Express.js API (Vercel Serverless)
│   ├── models/         # MongoDB Schemas
│   ├── controllers/    # API Logic
│   └── routes/         # Endpoint Definitions
└── LICENSE             # MIT License
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js 20.x or higher
- MongoDB Atlas cluster
- Google Gemini API Key

### 2. Manual Setup

**Backend Setup:**
```bash
cd backend
npm install
# Create a .env file with:
# MONGO_URI, JWT_SECRET, GEMINI_API_KEY, ADMIN_EMAIL
npm run dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
# Create a .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

---

## 🌍 Deployment

The platform is optimized for **Vercel**:
1. Deploy the `backend/` folder as a Serverless API.
2. Deploy the `frontend/` folder as a Next.js application.
3. Configure environment variables in the Vercel dashboard.

---

## 🤝 Contributing & Community

We believe in the power of shared knowledge. To contribute:
1. Fork the repo.
2. Create a feature branch.
3. Submit a Pull Request.
4. Join the community discussion via our Article system!

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact
For questions or project inquiries, please reach out to the project lead via the repository issues.

*Building a greener future, one analysis at a time.* 🌿

# 🐷 CHICHA: Feed Your Future

**CHICHA** is a gamified personal finance application designed to make budgeting and saving fun, interactive, and rewarding. By combining traditional financial tracking with a virtual pet experience and AI-driven insights, CHICHA helps users build better spending habits and reach their financial goals.

**Live Demo: [https://debugchewycookie-chicha.vercel.app/](https://debugchewycookie-chicha.vercel.app/)**

---

## Features

### <mark> Gamified Budgeting & Habit Building </mark>
Your financial health is directly tied to your **Chicha**—your virtual piggy bank pet. The app is built to transform the chore of budgeting into a rewarding game:
- **Emotional Feedback**: Stay within your budget to keep your Chicha happy and healthy. Overspending makes your pig grumpy, providing immediate emotional feedback on your spending habits.
- **Positive Reinforcement**: Earn coins and maintain streaks by logging expenses daily, turning consistency into a fun challenge.

### <mark>AI-Powered Financial Intelligence</mark>
CHICHA uses advanced AI to simplify your financial life:
- **AI Chat Bar**: Powered by Groq, simply tell Chicha what you spent (e.g., "Spent 200 on lunch at McDo"), and it will automatically categorize and log the transaction. No more tedious manual entry.
- **Personalized Financial Advice**: Get real-time, actionable advice from Chicha. Based on your spending patterns, Chicha will offer tips on how to save more and spend smarter.

### <mark>The Farm & Savings Goals</mark>
Every savings goal you create is represented by a pig in your virtual farm. Watch your farm grow as you set new targets and save more money.
- **Collaborative Farms**: Team up with friends or family to reach shared savings goals.
- **Progress Tracking**: Visual progress bars show how close you are to completing each goal.

### <mark>Smart Logging Tools</mark>
- **Receipt Scanner**: Use built-in OCR to scan physical receipts and log expenses in seconds.
- **Comprehensive Wallet Management**: Track multiple accounts including Cash, GCash, Maya, and various bank accounts (BPI, BDO, Landbank).

### <mark>Liabilities & Recurring Costs</mark>
- **Debt Tracker**: Manage your liabilities with a dedicated tracker, complete with payment history and completion milestones.
- **Subscription Manager**: Never forget a recurring payment. Keep track of all your active subscriptions in one place.

### <mark>Social & Rewards</mark>
- **Leaderboards**: Compete with others on saving streaks and financial milestones.
- **Daily Streaks**: Build a streak by logging your expenses daily and earn coins to customize your experience.

---

## How It Works

- **Frontend**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **AI Engine**: [Groq SDK](https://groq.com/) 
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/) 
- **OCR**: [Tesseract.js](https://tesseract.projectnaptha.com/) 
- **Animations**: [Framer Motion](https://www.framer.com/motion/) and [Canvas Confetti](https://github.com/catdad/canvas-confetti) 

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sgign/debugchewycookie-chicha.git
   cd debugchewycookie-chicha
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:5173](http://localhost:5173) to see the app in action!

---

## 📝 License
This project is for hackathon demonstration purposes. All assets and code are owned by the original contributors.

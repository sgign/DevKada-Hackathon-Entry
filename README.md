# CHICHA: Feed Your Future

**Chicha** is a gamified personal finance application designed to make budgeting and saving fun, interactive, and rewarding. By combining traditional financial tracking with a virtual pet experience, Chicha helps users build better spending habits and reach their financial goals.

---

## Features

### Gamified Budgeting
Your financial health is directly tied to your **Chicha**—your virtual piggy bank pet. Stay within your budget to keep your Chicha happy and healthy. Overspending might make your pig look a little grumpy!

### The Farm & Savings Goals
Every savings goal you create is represented by a pig in your virtual farm. Watch your farm grow as you set new targets and save more money.
- **Collaborative Farms**: Team up with friends or family to reach shared savings goals.
- **Progress Tracking**: Visual progress bars show how close you are to completing each goal.

### Smart Expense Logging
- **AI Chat Bar**: Simply tell Chicha what you spent (e.g., "Spent 200 on lunch at McDo"), and it will automatically categorize and log the transaction.
- **Receipt Scanner**: Use the built-in OCR (Optical Character Recognition) to scan physical receipts and log expenses in seconds.

### Comprehensive Financial Tools
- **Wallet Management**: Track multiple accounts including Cash, GCash, Maya, and various bank accounts (BPI, BDO, Landbank).
- **Debt Tracker**: Manage your liabilities with a dedicated debt tracker, complete with payment history and completion milestones.
- **Subscription Manager**: Never forget a recurring payment. Keep track of all your active subscriptions in one place.

### Social & Rewards
- **Leaderboards**: Compete with others on saving streaks and financial milestones.
- **Daily Streaks**: Build a streak by logging your expenses daily and earn coins to customize your experience.

---

## How It Works

#### Web Stack:

- **Frontend**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
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
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:5173](http://localhost:5173) to see the app in action!

---

## License
This project is for hackathon demonstration purposes. All assets and code are owned by the original contributors.

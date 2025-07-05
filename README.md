# 💰 Expense Tracker

A modern, full-stack expense tracking application built with Next.js, MongoDB, and TypeScript. Track your expenses, set budgets, and visualize your spending patterns with beautiful charts and real-time analytics.

![Expense Tracker Dashboard](https://via.placeholder.com/800x400/1e293b/ffffff?text=Dashboard+Preview)

## ✨ Features

- **📊 Real-time Analytics** - Interactive charts showing spending patterns by month and category
- **💳 Transaction Management** - Add, edit, and delete transactions with smart categorization
- **🎯 Budget Tracking** - Set budgets by category and monitor spending against targets
- **🌓 Dark/Light Mode** - Beautiful UI that adapts to your preference
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **⚡ Real-time Updates** - Instant UI updates without page refreshes
- **🔍 Advanced Filtering** - Filter transactions by date, category, amount, and type
- **📈 Visual Insights** - Pie charts, bar charts, and progress indicators

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:

   ```bash
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   # For production: mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📖 User Guide

### Getting Started

1. **Visit the homepage** and click "Start Tracking"
2. **Add your first transaction** using the "Add Transaction" button
3. **Set up budgets** in the Budget Manager tab
4. **Explore analytics** with interactive charts and filters

### Managing Transactions

- **Add Transaction**: Click the blue "Add Transaction" button (or press `A`)
- **Edit Transaction**: Click the edit icon next to any transaction
- **Filter Transactions**: Use the Filter and Date buttons to narrow down results
- **Quick Actions**: Use keyboard shortcuts for faster navigation

### Budget Management

- **Create Budget**: Go to Budget Manager tab and click "New Budget"
- **Track Progress**: View budget vs. actual spending in the Analytics section
- **Budget Alerts**: Visual indicators show when you're approaching or exceeding budgets

### Keyboard Shortcuts

- `A` - Add new transaction
- `R` - Refresh data
- `ESC` - Close dialogs

## 🏗️ Technical Overview

### Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB with Mongoose ODM
- **Charts**: Recharts library
- **UI Components**: Custom components with Shadcn/ui
- **Styling**: Tailwind CSS with dark mode support

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── app/               # Main dashboard
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/                # Base UI components
│   └── dashboard/         # Dashboard-specific components
├── lib/                   # Utilities and configurations
│   ├── schema.ts          # Zod validation schemas
│   └── mongodb.ts         # Database connection
└── styles/                # Global styles
```

### Database Schema

#### Transactions

```typescript
{
  description: string; // Transaction description
  amount: number; // Amount (positive for income, negative for expenses)
  type: 'income' | 'expense'; // Transaction type
  category: string; // Category (e.g., 'food', 'transport')
  date: Date; // Transaction date
}
```

#### Budgets

```typescript
{
  category: string; // Budget category
  budget: number; // Budget amount
  spent: number; // Currently spent amount (auto-calculated)
}
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run migrate      # Run database migration (fixes existing data)
```

### API Endpoints

- `GET /api/dashboard` - Dashboard summary data
- `GET /api/transactions` - Get transactions with pagination
- `GET /api/budgets` - Get all budgets
- Server Actions handle CREATE, UPDATE, DELETE operations

### Environment Variables

```bash
MONGODB_URI=mongodb://localhost:27017/expense-tracker
```

For production with MongoDB Atlas:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

Made with 💖 by [nerdyabhi](https://github.com/nerdyabhi)nerdyabhi

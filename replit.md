# CardVault - Credit Card Management App

## Overview
A Cred-inspired credit card management application with intelligent email/SMS parsing, reward tracking, and automated notifications. Built with React, Express, OpenAI GPT-5, and Gmail API integration.

## Features
- **Card Management**: Add, view, and manage multiple credit cards with customizable colors and details
- **Rewards Tracking**: Configure conditional rewards with threshold-based progress tracking
- **Transaction Management**: Manual entry or intelligent SMS parsing using OpenAI
- **Email Integration**: Automated parsing of credit card statements, bills, and offers from Gmail
- **Smart Notifications**: Bill alerts, reward unlocks, and offer change summaries
- **Beautiful UI**: Cred-inspired dark theme with purple gradients and smooth animations

## Architecture

### Frontend (React + TypeScript)
- **Components**: Modular, reusable components following shadcn/ui patterns
- **State Management**: TanStack Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom design tokens, dark mode by default
- **Animations**: Framer Motion for smooth transitions and progress indicators

### Backend (Express + TypeScript)
- **Storage**: In-memory storage with full CRUD operations
- **AI Integration**: OpenAI GPT-5 for transaction extraction and email analysis
- **Gmail API**: Replit connector for automated email fetching
- **API Routes**: RESTful endpoints for cards, rewards, transactions, notifications

## Key User Journeys

### 1. Add a Credit Card
1. Click "Add Card" button
2. Fill in card details (name, bank, last 4 digits, network, limit)
3. Choose card color for visual identification
4. Card appears in dashboard with gradient design

### 2. Configure Rewards
1. Navigate to Rewards tab
2. Click "Add Reward"
3. Select card, set reward type and value
4. Define condition and spending threshold
5. Track progress with animated progress bar

### 3. Parse SMS Transaction
1. Go to Transactions tab
2. Click "Parse SMS"
3. Paste transaction SMS from bank
4. AI extracts merchant, amount, category
5. Transaction auto-associates with card
6. Reward progress updates automatically

### 4. Check Gmail for Bills/Offers
1. Navigate to Notifications tab
2. Click "Check Gmail"
3. System fetches credit card-related emails
4. AI analyzes for bills, statements, or offer changes
5. Notifications created with simple summaries

## Recent Changes
- October 15, 2025: Initial implementation with all MVP features
- Integrated OpenAI GPT-5 for intelligent parsing
- Connected Gmail via Replit connector for email automation
- Implemented real-time reward threshold tracking
- Added beautiful loading states and error handling

## Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Express, Node.js, TypeScript
- **AI/ML**: OpenAI GPT-5 for NLP tasks
- **Email**: Gmail API via Replit connector
- **Storage**: In-memory (MemStorage) for MVP
- **Validation**: Zod schemas, React Hook Form

## Design System
- **Primary Color**: Purple (#8B5CF6) - Cred-inspired brand color
- **Success**: Green (#10B981) - Reward unlocks and achievements
- **Warning**: Orange (#F59E0B) - Bill alerts and thresholds
- **Typography**: Inter font family for clean, modern look
- **Spacing**: Consistent 6-8-12-16-24px scale
- **Animations**: Subtle hover elevations, progress bar fills, unlock celebrations

## API Endpoints

### Cards
- `GET /api/cards` - List all cards
- `POST /api/cards` - Create new card
- `DELETE /api/cards/:id` - Remove card

### Rewards
- `GET /api/rewards` - List all rewards
- `POST /api/rewards` - Create new reward

### Transactions
- `GET /api/transactions` - List all transactions
- `POST /api/transactions` - Create transaction (auto-updates rewards)
- `POST /api/parse-sms` - Parse SMS and create transaction

### Notifications
- `GET /api/notifications` - List all notifications
- `POST /api/parse-emails` - Fetch and parse Gmail emails
- `PATCH /api/notifications/:id/read` - Mark as read

## Environment Variables
- `OPENAI_API_KEY` - OpenAI API key for GPT-5 access
- `SESSION_SECRET` - Express session secret
- Gmail credentials managed via Replit connector

## Development Notes
- All components use data-testid attributes for testing
- Loading skeletons maintain visual consistency during data fetching
- Reward progress auto-updates when transactions are added
- Card balances track cumulative spending
- Notifications auto-generate for reward unlocks and email insights

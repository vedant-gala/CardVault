# CardVault - Credit Card Management App

## Overview
A Cred-inspired credit card management application with intelligent email/SMS parsing, reward tracking, and automated notifications. Built with React, Express, OpenAI GPT-5, Replit Auth, and Gmail API integration.

## Features
- **User Authentication**: Secure login/logout with Replit Auth (Google, GitHub, email/password)
- **Card Management**: Add, view, delete, and manage multiple credit cards with customizable colors and details
- **Rewards Tracking**: Configure conditional rewards with threshold-based progress tracking
- **Transaction Management**: Manual entry or intelligent SMS parsing using OpenAI
- **Email Integration**: Automated parsing of credit card statements, bills, and offers from Gmail
- **Bill Payments**: View bills, track payment status, and make payments with multiple payment methods
- **Smart Notifications**: Bill alerts, reward unlocks, payment confirmations, and offer change summaries
- **Real-Time Push Notifications**: WebSocket-powered instant alerts for transactions and reward unlocks
- **Credit Score Tracking**: Monitor credit score history with improvement suggestions
- **Spending Analytics**: Category breakdowns, monthly comparisons, and spending insights
- **AI-Powered Recommendations**: Personalized credit card offers based on spending patterns
- **Beautiful UI**: Cred-inspired dark theme with purple gradients and smooth animations
- **Data Isolation**: Complete user data isolation with secure session management

## Architecture

### Frontend (React + TypeScript)
- **Components**: Modular, reusable components following shadcn/ui patterns
- **State Management**: TanStack Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom design tokens, dark mode by default
- **Animations**: Framer Motion for smooth transitions and progress indicators

### Backend (Express + TypeScript)
- **Authentication**: Replit Auth with OIDC (OpenID Connect) supporting Google, GitHub, and email/password login
- **Database**: PostgreSQL (Neon) with Drizzle ORM for data persistence
- **Session Management**: PostgreSQL-backed sessions with 7-day TTL and secure cookies
- **Authorization**: isAuthenticated middleware on all API routes with userId-based data filtering
- **AI Integration**: OpenAI GPT-5 for transaction extraction, email analysis, and offer recommendations
- **Gmail API**: Replit connector for automated email fetching
- **WebSocket**: Real-time push notifications for transactions and reward unlocks
- **API Routes**: RESTful endpoints for cards, rewards, transactions, notifications, bills, payments, analytics
- **Security**: Resource-level ownership verification prevents cross-user data access

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
- October 16, 2025: **Fixed notifications isolation and added missing payments route**
  - **Notifications User Isolation**: Added userId column to notifications table for proper user scoping
  - **Query Fix**: Updated getNotifications to support both userId-based and card-based notifications (backwards compatible)
  - **Ownership Verification**: Enhanced markNotificationAsRead to verify ownership via userId OR cardId
  - **Missing Route**: Added GET /api/payments/bill/:billId with proper userId authorization
  - **Bug Fix**: POST /api/notifications now correctly passes userId parameter
  - All changes tested with e2e playwright tests and architect-approved
- October 16, 2025: **Completed full CRUD operations and security hardening**
  - **Edit Functionality**: Added EditCardDialog, EditRewardDialog, and EditTransactionDialog components
  - **PATCH Endpoints**: Created /api/cards/:id, /api/rewards/:id, and /api/transactions/:id with Zod validation
  - **Delete Transaction**: Implemented transaction deletion with userId ownership verification
  - **Credit Score Management**: Added AddCreditScoreDialog for manual credit score entry
  - **WebSocket Security**: Replaced query parameter userId with session-based authentication to prevent spoofing
  - **Input Validation**: All PATCH endpoints now validate with insertSchema.partial() before storage mutations
  - **Bug Fix**: PATCH /api/transactions now recalculates reward progress and triggers unlock notifications when amount changes
  - All security vulnerabilities resolved and architect-approved
- October 16, 2025: **Implemented complete user authentication and authorization system**
  - Added Replit Auth with OIDC supporting Google, GitHub, and email/password login
  - Created users and sessions tables with PostgreSQL-backed session storage
  - Implemented isAuthenticated middleware protecting all API routes
  - Added userId foreign keys to cards and creditScores tables for data isolation
  - Updated all storage methods with resource-level ownership verification
  - Created Landing page for logged-out users with login button
  - Added logout functionality to Dashboard with secure session termination
  - **Security**: Fixed cross-tenant data access vulnerability with userId filtering on all operations
- October 15, 2025: Completed all 6 core features
- Migrated from in-memory storage to PostgreSQL database with full persistence
- Implemented bill payment system with payment tracking, status management, and autopay infrastructure
- Added credit score tracking with history visualization and improvement suggestions
- Built spending analytics dashboard with category breakdowns and monthly comparisons
- Integrated AI-powered offer recommendations using OpenAI GPT-5 based on spending patterns
- Implemented WebSocket push notification system for real-time transaction alerts and reward unlocks
- Connected Gmail via Replit connector for email automation
- Added card deletion functionality with hover-reveal delete button
- Beautiful loading states, error handling, and Cred-inspired dark theme

## Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Express, Node.js, TypeScript
- **AI/ML**: OpenAI GPT-5 for NLP tasks
- **Email**: Gmail API via Replit connector
- **Database**: PostgreSQL via Neon with Drizzle ORM
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
- `PATCH /api/cards/:id` - Update card (validates with Zod partial schema)
- `DELETE /api/cards/:id` - Remove card

### Rewards
- `GET /api/rewards` - List all rewards
- `POST /api/rewards` - Create new reward
- `PATCH /api/rewards/:id` - Update reward (validates with Zod partial schema)

### Transactions
- `GET /api/transactions` - List all transactions
- `POST /api/transactions` - Create transaction (auto-updates rewards)
- `PATCH /api/transactions/:id` - Update transaction (recalculates reward progress, validates with Zod partial schema)
- `DELETE /api/transactions/:id` - Delete transaction
- `POST /api/parse-sms` - Parse SMS and create transaction

### Notifications
- `GET /api/notifications` - List all notifications
- `POST /api/parse-emails` - Fetch and parse Gmail emails
- `PATCH /api/notifications/:id/read` - Mark as read

### Bills & Payments
- `GET /api/bills` - List all bills
- `GET /api/bills/card/:cardId` - Get bills for a specific card
- `POST /api/bills` - Create new bill (auto-generates notification)
- `PATCH /api/bills/:id/status` - Update bill status
- `GET /api/payments` - List all payments
- `GET /api/payments/card/:cardId` - Get payments for a specific card
- `POST /api/payments` - Make a payment (auto-updates bill status and creates notification)
- `GET /api/autopay` - List autopay settings
- `GET /api/autopay/card/:cardId` - Get autopay settings for a card
- `POST /api/autopay` - Create autopay settings
- `PATCH /api/autopay/:id` - Update autopay settings

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `OPENAI_API_KEY` - OpenAI API key for GPT-5 access
- `SESSION_SECRET` - Express session secret
- Gmail credentials managed via Replit connector

## Known Limitations
- **Gmail Integration**: The current Gmail connector has limited OAuth scopes (addon-specific permissions) which don't include the `gmail.readonly` scope needed to list and read user messages. When users click "Check Gmail", they will receive a clear error message explaining that email parsing requires additional permissions. The SMS parsing feature works as a complete alternative for transaction extraction.
- **Autopay Functionality**: While autopay settings can be created and updated via API, the automated execution logic (scheduler/cron) is not yet implemented. Users can manually pay bills, and autopay infrastructure is ready for future scheduler integration.

## Development Notes
- All components use data-testid attributes for testing
- Loading skeletons maintain visual consistency during data fetching
- Reward progress auto-updates when transactions are added
- Card balances track cumulative spending
- Notifications auto-generate for reward unlocks and email insights

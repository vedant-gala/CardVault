# CardVault - Credit Card Management App

## Overview
A Cred-inspired credit card management application with intelligent email/SMS parsing, reward tracking, and automated notifications. Built with React, Express, OpenAI GPT-5, and Gmail API integration.

## Features
- **Card Management**: Add, view, delete, and manage multiple credit cards with customizable colors and details
- **Rewards Tracking**: Configure conditional rewards with threshold-based progress tracking
- **Transaction Management**: Manual entry or intelligent SMS parsing using OpenAI
- **Email Integration**: Automated parsing of credit card statements, bills, and offers from Gmail
- **Bill Payments**: View bills, track payment status, and make payments with multiple payment methods
- **Smart Notifications**: Bill alerts, reward unlocks, payment confirmations, and offer change summaries
- **Beautiful UI**: Cred-inspired dark theme with purple gradients and smooth animations

## Architecture

### Frontend (React + TypeScript)
- **Components**: Modular, reusable components following shadcn/ui patterns
- **State Management**: TanStack Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom design tokens, dark mode by default
- **Animations**: Framer Motion for smooth transitions and progress indicators

### Backend (Express + TypeScript)
- **Database**: PostgreSQL (Neon) with Drizzle ORM for data persistence
- **AI Integration**: OpenAI GPT-5 for transaction extraction and email analysis
- **Gmail API**: Replit connector for automated email fetching
- **API Routes**: RESTful endpoints for cards, rewards, transactions, notifications, bills, payments

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
- Migrated from in-memory storage to PostgreSQL database with full persistence
- Added card deletion functionality with hover-reveal delete button
- Implemented bill payment system with payment tracking and status management
- Integrated OpenAI GPT-5 for intelligent parsing
- Connected Gmail via Replit connector for email automation
- Implemented real-time reward threshold tracking
- Added beautiful loading states and error handling

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

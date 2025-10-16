# Missing Features - CardVault

This document outlines features that are not yet implemented in the CardVault credit card management application. These features would enhance functionality, user experience, and competitiveness with commercial solutions.

## 1. Transaction Search & Filtering ✅ **IMPLEMENTED**

### Current State
**FULLY IMPLEMENTED** - Comprehensive search, filtering, sorting, and pagination system is now available.

### Implemented Features
- ✅ **Search Functionality**: Full-text search by merchant name and description
- ✅ **Date Range Filtering**: Custom date ranges with calendar picker UI
- ✅ **Category Filtering**: Multi-select category filtering
- ✅ **Card Filtering**: Filter by one or multiple cards
- ✅ **Amount Range Filtering**: Min/max amount range filtering
- ✅ **Source Filtering**: Filter by manual vs SMS transactions
- ✅ **Sorting Options**: Sort by date, amount, merchant, or category (asc/desc)
- ✅ **Pagination**: Configurable page size (10, 25, 50, 100) with smart navigation
- ✅ **Advanced Queries**: All filters work together for complex queries
- ✅ **Database Indexes**: Added indexes for optimized search performance
- ✅ **Server-Side Processing**: Efficient database queries with filtering/sorting/pagination
- ✅ **Active Filter Indicators**: Visual badges showing active filters
- ✅ **Quick Filter Removal**: One-click to remove individual or all filters

### Implementation Details
- **New API Endpoint**: `POST /api/transactions/query`
- **New Components**: `TransactionFilters`, `TransactionPagination`
- **Database Optimization**: Indexes on merchant, category, date, source, cardId
- **See**: `TRANSACTION_SEARCH_IMPLEMENTATION.md` for complete documentation

### Impact Achieved
- ✅ Better transaction discovery and analysis
- ✅ Improved performance with large transaction histories  
- ✅ Enhanced user experience for finding specific transactions

---

## 2. Data Export & Backup

### Current State
No export or backup functionality exists. Users cannot extract their data from the application.

### Missing Capabilities
- **CSV Export**: Cannot export transactions, rewards, or bills to CSV format
- **Excel Export**: No XLSX format export option
- **PDF Statements**: Cannot generate PDF statements for cards
- **Transaction Reports**: No downloadable transaction reports by date range or card
- **Full Data Backup**: No complete data export (all cards, transactions, rewards, etc.)
- **Scheduled Exports**: No automatic periodic backup exports
- **Selective Export**: Cannot choose specific data ranges or types to export
- **Import Functionality**: No way to import transactions from external sources

### Potential Impact
- Critical for data portability and user control
- Essential for tax preparation and record-keeping
- Important for migration to other platforms
- Regulatory compliance (GDPR right to data portability)

---

## 3. Budget Management

### Current State
Analytics show spending totals but no budget tracking or limits exist.

### Missing Capabilities
- **Monthly Budgets**: Cannot set overall monthly spending budgets
- **Category Budgets**: No budget limits per category (Food, Travel, etc.)
- **Card-Specific Budgets**: Cannot set spending limits per card
- **Budget Alerts**: No notifications when approaching budget limits
- **Budget Progress**: Missing visual indicators of budget utilization
- **Budget vs. Actual**: No comparison reports of budgeted vs. actual spending
- **Rollover Budgets**: Cannot roll unused budget to next period
- **Budget Templates**: No preset budget templates
- **Budget History**: Cannot view historical budget performance
- **Budget Sharing**: No shared budgets for families

### Potential Impact
- Critical feature for financial planning and discipline
- Helps prevent overspending
- Provides proactive spending management
- Differentiates from basic transaction trackers

---

## 4. Recurring Transaction & Subscription Management

### Current State
All transactions are treated as one-time events.

### Missing Capabilities
- **Subscription Detection**: No automatic detection of recurring payments
- **Subscription Tracking**: Cannot manually tag/track subscriptions (Netflix, Spotify, etc.)
- **Recurring Transaction List**: No dedicated view for recurring expenses
- **Subscription Reminders**: Missing alerts for upcoming subscription charges
- **Subscription Cost Analysis**: No total monthly subscription cost calculation
- **Cancellation Tracking**: Cannot track canceled subscriptions
- **Free Trial Monitoring**: No reminders for ending free trials
- **Subscription Optimization**: No suggestions for unused subscriptions
- **Annual vs. Monthly**: Cannot compare annual vs. monthly subscription costs
- **Subscription Categories**: Missing categorization of subscription types

### Potential Impact
- Helps identify and manage recurring costs
- Prevents forgotten subscriptions from draining funds
- Major feature in modern expense management apps

---

## 5. Multi-Currency Support

### Current State
All amounts are hardcoded to ₹ (Indian Rupees).

### Missing Capabilities
- **Foreign Currency Transactions**: Cannot record transactions in other currencies
- **Exchange Rate Tracking**: No automatic currency conversion
- **Multi-Currency Cards**: Cannot mark cards as foreign currency cards
- **Exchange Rate History**: No historical exchange rate data
- **Currency Conversion Display**: Cannot view transactions in multiple currencies
- **Default Currency Settings**: No user preference for currency
- **International Transaction Fees**: Cannot track foreign transaction fees
- **Currency Analytics**: Missing spending analysis by currency
- **Real-Time Exchange Rates**: No integration with currency APIs

### Potential Impact
- Essential for international travelers
- Critical for foreign currency credit cards
- Limits usability for global users

---

## 6. Card Security Features

### Current State
Basic authentication exists, but no card-specific security features.

### Missing Capabilities
- **Card Lock/Unlock**: Cannot temporarily lock/freeze cards
- **Fraud Detection**: No suspicious transaction pattern detection
- **Transaction Alerts**: Missing real-time alerts for large transactions
- **Velocity Checks**: No alerts for multiple rapid transactions
- **Fraud Reporting**: Cannot mark transactions as fraudulent
- **Dispute Management**: No transaction dispute workflow
- **Security Questions**: No additional verification for sensitive operations
- **Two-Factor Authentication**: Missing 2FA for critical actions
- **PIN Management**: Cannot store/manage card PINs securely
- **Virtual Card Numbers**: No virtual card number generation
- **Biometric Authentication**: No fingerprint/face recognition option
- **Session Management**: Cannot view/manage active sessions

### Potential Impact
- Critical for user trust and security
- Prevents unauthorized access
- Helps quickly respond to fraud
- Industry-standard security features

---

## 7. Advanced Analytics & Insights

### Current State
Basic spending analytics exist (category breakdown, monthly comparison).

### Missing Capabilities
- **Year-over-Year Comparisons**: Cannot compare spending across years
- **Merchant Frequency Analysis**: No insights on most-visited merchants
- **Spending Trend Predictions**: Missing AI-powered spending forecasts
- **Cashback Optimization**: No suggestions on maximizing rewards
- **Credit Utilization Tracking**: Missing balance vs. limit ratio monitoring
- **Payment History Timeline**: No visual timeline of payment patterns
- **Seasonal Spending Patterns**: Cannot identify seasonal trends
- **Day-of-Week Analysis**: Missing insights on spending by day
- **Peak Spending Times**: No identification of spending patterns by time
- **Category Trends**: Cannot see category spending trends over time
- **Comparative Analytics**: No benchmarking against averages
- **Savings Opportunities**: Missing suggestions for cost reduction
- **Custom Metrics**: Cannot define custom analytics metrics
- **Export Analytics**: Cannot export charts/graphs as images

### Potential Impact
- Provides actionable financial insights
- Helps users make informed decisions
- Differentiates from basic tracking apps
- Leverages AI/ML capabilities

---

## 8. Bill Management Enhancements

### Current State
Basic bill viewing and manual payment functionality exists.

### Missing Capabilities
- **Auto-Bill Generation**: No automatic bill creation from transaction totals
- **Partial Payment Tracking**: Cannot track multiple partial payments per bill
- **Late Payment Fees**: No tracking of late fees or penalties
- **Interest Calculation**: Missing interest on outstanding balances
- **Minimum Payment Warnings**: No alerts for paying only minimum due
- **Bill History**: Limited historical bill viewing
- **Bill Splitting**: Cannot split bills across multiple payments
- **Payment Plans**: No installment/EMI tracking
- **Bill Disputes**: Cannot dispute bill amounts
- **Manual Bill Adjustment**: Limited bill editing capabilities
- **Bill Forecasting**: No prediction of upcoming bills
- **Grace Period Tracking**: Missing grace period calculations

### Potential Impact
- Better bill payment management
- Reduces late payment risk
- Helps avoid interest charges
- More complete financial picture

---

## 9. Reward Program Features

### Current State
Basic reward progress tracking and unlock notifications exist.

### Missing Capabilities
- **Reward Redemption Tracking**: Cannot track when/how rewards are redeemed
- **Reward Expiry Notifications**: No alerts for expiring reward points
- **Points Value Estimation**: Missing monetary value of accumulated points
- **Reward Program Comparison**: Cannot compare rewards across cards
- **Referral Bonus Tracking**: No tracking of referral rewards
- **Reward Tiers**: Cannot track tier status in reward programs
- **Reward Optimization**: No suggestions on which card to use for maximum rewards
- **Cashback History**: Missing historical cashback earnings
- **Points Transfer**: Cannot track points transfers between programs
- **Reward Categories**: No categorization of reward types
- **Anniversary Bonuses**: Missing tracking of annual reward bonuses
- **Milestone Rewards**: Cannot set/track reward milestones

### Potential Impact
- Maximizes reward value for users
- Prevents reward expiry losses
- Helps choose best card for purchases
- Key differentiator for power users

---

## 10. Notification Customization

### Current State
Notifications are automatically generated with no user control.

### Missing Capabilities
- **Notification Preferences**: Cannot enable/disable specific notification types
- **Threshold Customization**: No custom amount thresholds for alerts
- **Digest/Summary Mode**: Missing option for daily/weekly summaries
- **Quiet Hours**: Cannot set do-not-disturb time periods
- **Notification Channels**: No choice between email, SMS, push, in-app
- **Priority Levels**: Cannot set notification urgency levels
- **Notification History**: No searchable notification archive
- **Notification Cleanup**: Cannot bulk delete old notifications
- **Snooze Functionality**: Cannot temporarily snooze notifications
- **Smart Notifications**: No ML-based notification relevance
- **Notification Templates**: Cannot customize notification messages
- **Desktop Notifications**: Missing browser notification support

### Potential Impact
- Reduces notification fatigue
- Improves user experience
- Allows personalization
- Prevents important alerts from being missed

---

## 11. Card Details & Metadata

### Current State
Cards store basic information (name, bank, last 4 digits, limit, network).

### Missing Capabilities
- **Issuer Contact Info**: No phone numbers or customer service contacts
- **APR/Interest Rate**: Cannot track interest rates
- **Annual Fee Tracking**: Missing annual fee amounts and renewal dates
- **Card Benefits**: No documentation of card perks (lounge access, insurance, etc.)
- **Card Anniversary**: Cannot track card account opening date
- **Card Type**: No distinction between credit/debit/charge cards
- **Card Tier**: Missing card tier/level (Platinum, Gold, etc.)
- **Statement Cycle**: Limited billing cycle information
- **Grace Period**: Cannot store grace period days
- **Card Limits**: No separate limits for different transaction types
- **Card Expiry**: Cannot track card expiration dates
- **Replacement Tracking**: No history of card replacements
- **Card Notes**: Cannot add custom notes to cards

### Potential Impact
- Provides complete card information
- Helps remember important dates and fees
- Documents card benefits for reference
- Better card management

---

## 12. Transaction Details Enhancement

### Current State
Transactions have basic fields (merchant, amount, category, date, description).

### Missing Capabilities
- **Custom Tags**: Cannot add custom tags/labels to transactions
- **Receipt Attachments**: No ability to attach receipt images
- **Transaction Notes**: Limited note/memo field
- **Refund Tracking**: No explicit refund/reversal handling
- **Transaction Splits**: Cannot split one transaction across categories
- **Merchant Logos**: Missing merchant logo/icon display
- **Transaction Status**: No pending/completed/failed status tracking
- **Dispute Status**: Cannot track dispute resolution status
- **Transaction Location**: No GPS/location data
- **Transaction Type**: No distinction between purchase/withdrawal/payment
- **Recurring Flag**: Cannot manually mark transactions as recurring
- **Tax Category**: No tax-deductible expense flagging
- **Project/Client Tagging**: Missing business expense categorization

### Potential Impact
- Richer transaction data
- Better expense documentation
- Important for business users
- Enhanced transaction search

---

## 13. Payment Methods Management

### Current State
Payment methods are specified per payment but not saved/managed.

### Missing Capabilities
- **Saved Payment Methods**: Cannot save payment method profiles
- **Default Payment Method**: No default payment method per card
- **Payment Method Verification**: Missing bank account verification
- **Multiple Bank Accounts**: Cannot manage multiple linked accounts
- **Payment Scheduling**: No future-dated payment scheduling
- **Payment Method History**: Cannot view which methods were used when
- **Payment Limits**: No limits per payment method
- **Payment Method Nicknames**: Cannot name payment methods
- **Automatic Method Selection**: No smart payment method suggestions
- **Payment Method Security**: Missing CVV/OTP verification

### Potential Impact
- Streamlines payment process
- Better payment tracking
- Reduces payment errors
- Essential for autopay functionality

---

## 14. User Preferences & Settings

### Current State
Application has fixed dark theme with no customization options.

### Missing Capabilities
- **Theme Toggle**: Cannot switch between dark/light modes
- **Currency Preference**: No default currency setting
- **Date Format**: Cannot customize date format (MM/DD vs DD/MM)
- **Number Format**: No thousand separator customization
- **Language/Locale**: Missing localization options
- **Time Zone**: Cannot set user timezone
- **Data Retention**: No control over data retention policies
- **Account Settings**: Limited user profile management
- **Privacy Settings**: No privacy/sharing controls
- **Accessibility Options**: Missing font size, contrast adjustments
- **Dashboard Preferences**: Cannot customize dashboard layout
- **Default Views**: No saved default view preferences
- **Keyboard Shortcuts**: No customizable shortcuts

### Potential Impact
- Better accessibility
- Personalized user experience
- International usability
- User control over data

---

## 15. Dashboard Customization

### Current State
Dashboard has fixed stats cards and layout.

### Missing Capabilities
- **Widget Customization**: Cannot add/remove/rearrange widgets
- **This Month Calculation**: "This Month" stat currently shows ₹0 (not implemented)
- **Custom Metrics**: Cannot add custom stat cards
- **Dashboard Layouts**: No preset or custom layouts
- **Favorite Cards**: Cannot pin/star favorite cards
- **Quick Actions**: No customizable quick action buttons
- **Recent Activity**: Missing recent activity feed
- **Upcoming Events**: No upcoming bills/payments widget
- **Goal Progress**: Cannot display savings/spending goals
- **Comparison Widgets**: Missing period-over-period comparisons
- **Chart Customization**: Cannot choose chart types/styles
- **Refresh Controls**: No manual refresh or auto-refresh settings

### Potential Impact
- Personalized dashboard experience
- Quick access to relevant information
- Better information density
- User engagement

---

## 16. Credit Score Enhancements

### Current State
Credit scores can be manually entered with basic history viewing.

### Missing Capabilities
- **Credit Score Goals**: Cannot set target credit score
- **Factor Breakdown Visualization**: No visual representation of score factors
- **Credit Score Simulator**: Cannot simulate impact of actions on score
- **Score Improvement Tracking**: Limited progress tracking over time
- **Score Change Alerts**: No notifications when score changes
- **Score Trend Analysis**: Missing trend predictions
- **Factor Impact Analysis**: Cannot see which factors hurt/help most
- **Credit Report Integration**: No automatic score fetching from bureaus
- **Multi-Bureau Tracking**: Cannot track scores from multiple bureaus
- **Score History Export**: Cannot export score history
- **Comparison Tools**: No benchmarking against averages
- **Credit Health Score**: Missing overall credit health metric

### Potential Impact
- Better credit management
- Helps improve credit score
- Educational value for users
- Competitive differentiator

---

## 17. Collaboration Features

### Current State
Single-user accounts only, no sharing or collaboration.

### Missing Capabilities
- **Shared Cards**: Cannot share cards with family members
- **Expense Splitting**: No bill splitting functionality
- **Multi-User Accounts**: Cannot have joint accounts
- **Authorized Users**: No authorized user management
- **Permission Levels**: Missing role-based access control
- **Activity Sharing**: Cannot share transactions/reports
- **Household Budgets**: No shared family budgets
- **Expense Approval**: Cannot require approval for expenses
- **User Roles**: No admin/viewer/editor roles
- **Audit Trail**: Missing activity logs for shared cards

### Potential Impact
- Family-friendly features
- Business expense management
- Shared financial planning
- Competitive feature for couples/families

---

## 18. Reminder & Alert System

### Current State
Only reward unlock and payment notifications exist.

### Missing Capabilities
- **Payment Due Reminders**: No alerts X days before payment due
- **Low Balance Alerts**: Cannot set low balance thresholds
- **Unusual Spending Alerts**: No anomaly detection notifications
- **Reward Expiry Reminders**: Missing points/cashback expiry alerts
- **Card Renewal Reminders**: No card expiration notifications
- **Budget Threshold Alerts**: Cannot set budget limit warnings
- **Bill Due Alerts**: Limited bill reminder system
- **Subscription Reminders**: No recurring payment alerts
- **Annual Fee Reminders**: Cannot set annual fee due dates
- **Goal Milestone Alerts**: No savings goal notifications
- **Custom Reminders**: Cannot create custom reminder events
- **Smart Scheduling**: No ML-based optimal reminder timing

### Potential Impact
- Prevents missed payments and late fees
- Proactive financial management
- Reduces user anxiety
- Key retention feature

---

## 19. Tax & Reporting

### Current State
No tax-related features exist.

### Missing Capabilities
- **Tax-Deductible Tagging**: Cannot mark expenses as tax-deductible
- **Annual Tax Reports**: No year-end expense summaries
- **Business Expense Separation**: Cannot separate personal/business expenses
- **Tax Category Mapping**: No mapping of categories to tax categories
- **IRS/Tax Forms**: Cannot generate tax-ready reports
- **Charitable Contributions**: No tracking of donations
- **Business Mileage**: Cannot track travel expenses
- **Client/Project Tracking**: Missing business expense attribution
- **Tax Document Export**: Cannot export in tax software formats
- **Quarterly Reports**: No quarterly business expense summaries
- **Accountant Sharing**: Cannot share reports with accountants
- **Tax Compliance**: No tax regulation compliance features

### Potential Impact
- Essential for business users
- Simplifies tax preparation
- Reduces accounting costs
- Expands target market

---

## 20. Performance & UX Enhancements

### Current State
Web application with real-time updates, no offline capabilities.

### Missing Capabilities
- **Offline Mode**: No offline data access or PWA support
- **Keyboard Shortcuts**: Cannot use keyboard for navigation
- **Bulk Operations**: Cannot select/delete/edit multiple items at once
- **Undo/Redo**: No action reversal capability
- **Data Sync Status**: No indicator of sync status
- **Loading States**: Some missing loading indicators
- **Error Recovery**: Limited error handling and recovery
- **Progressive Loading**: No infinite scroll or lazy loading
- **Search Performance**: No indexed search for large datasets
- **Caching Strategy**: Limited client-side caching
- **Mobile App**: No native mobile applications
- **Responsive Design**: Some layout issues on mobile
- **Touch Gestures**: No swipe actions on mobile
- **App Shortcuts**: No Android/iOS app shortcuts

### Potential Impact
- Better performance
- Improved user experience
- Mobile-first experience
- Reduced friction
- Power user efficiency

---

## Priority Recommendations

### High Priority (Core Functionality)
1. **This Month Spending Calculation** - Dashboard shows ₹0
2. **Transaction Search & Filtering** - Essential for usability
3. **Data Export** - Critical for data portability
4. **Budget Management** - Key differentiation feature
5. **Card Security Features** - Trust and safety

### Medium Priority (User Experience)
6. **Recurring Transaction Tracking** - Modern necessity
7. **Advanced Analytics** - Value-added insights
8. **Notification Customization** - Reduces notification fatigue
9. **Theme Toggle** - Accessibility and preference
10. **Payment Due Reminders** - Prevents late fees

### Lower Priority (Nice to Have)
11. **Multi-Currency Support** - Depends on target market
12. **Collaboration Features** - Specific use cases
13. **Tax & Reporting** - Business user segment
14. **Offline Mode** - Enhanced experience
15. **Credit Score Enhancements** - Advanced features

---

## Implementation Considerations

### Quick Wins
- Fix "This Month" spending calculation in DashboardStats
- Add basic transaction search/filter
- Implement notification preferences
- Add dark/light theme toggle
- Create CSV export for transactions

### Technical Debt
- Add database indexing for search performance
- Implement proper pagination
- Add caching layer for analytics
- Optimize WebSocket connection management

### Infrastructure Needed
- File storage service (for receipts)
- Background job scheduler (for autopay, reminders)
- Email service (for digests, reports)
- Currency conversion API
- Tax regulation database

---

*Document last updated: October 16, 2025*
*Based on codebase analysis of CardVault v1.0*


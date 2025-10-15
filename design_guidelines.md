# Design Guidelines: Cred-Inspired Credit Card Management App

## Design Approach
**Reference-Based: Cred-Inspired Premium Design**
Drawing from Cred's signature dark, gamified aesthetic with premium gradients, bold typography, and playful reward mechanics. The design emphasizes financial empowerment through visual clarity and engagement.

## Core Design Principles
1. **Premium Dark Aesthetic**: Sophisticated dark interface that makes financial data feel exciting
2. **Gamified Progress**: Visual reward tracking that motivates engagement
3. **Card-Centric Design**: Cards as hero elements, not data rows
4. **Clarity in Complexity**: Simplify complex financial data through visual hierarchy
5. **Trust Through Design**: Professional polish that inspires confidence in financial management

## Color Palette

### Dark Mode (Primary)
- **Background Base**: 12 8% 6% (deep charcoal)
- **Surface Elevated**: 250 15% 12% (dark purple-tinted surface)
- **Primary Brand**: 270 60% 55% (vibrant purple - Cred signature)
- **Accent Success**: 142 70% 45% (reward green)
- **Accent Warning**: 25 95% 55% (threshold alert)
- **Text Primary**: 0 0% 98%
- **Text Muted**: 240 5% 64%

### Gradient Treatments
- **Card Backgrounds**: Subtle gradients from 270 40% 20% to 280 35% 15%
- **Reward Progress**: Animated gradients from primary purple to accent green
- **Hero Elements**: Deep purple 270 60% 25% to dark blue 240 55% 20%

## Typography
- **Primary Font**: Inter (via Google Fonts CDN) - clean, modern, excellent readability
- **Display/Headers**: Font weight 700-800, letter-spacing -0.02em
- **Body Text**: Font weight 400-500, line-height 1.6
- **Card Details**: Font weight 600, tabular numbers for amounts
- **Hierarchy**: 
  - Hero: text-5xl to text-7xl
  - Section Headers: text-3xl to text-4xl
  - Card Titles: text-xl to text-2xl
  - Body: text-base
  - Captions: text-sm with muted color

## Layout System
**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 24
- Component padding: p-6 to p-8
- Section spacing: space-y-8 to space-y-16
- Card gaps: gap-6
- Container max-width: max-w-7xl with px-4 to px-8

## Component Library

### Card Display Components
- **Physical Card Representation**: 
  - 3D-inspired card mockups with subtle shadows and gradients
  - Bank logo placement (top-left)
  - Last 4 digits prominently displayed
  - Card network icon (Visa/Mastercard) bottom-right
  - Aspect ratio: 1.586:1 (standard credit card)
  
- **Card Grid**: 
  - Desktop: grid-cols-2 lg:grid-cols-3
  - Mobile: Single column stack
  - Hover state: Subtle lift transform and glow effect

### Reward Tracking Components
- **Progress Bars**: 
  - Height: h-3 to h-4
  - Rounded: rounded-full
  - Animated fill with gradient
  - Percentage display overlay
  
- **Threshold Indicators**:
  - Badge-style pills showing "₹2,450 / ₹5,000"
  - Color-coded: Muted when not met, vibrant green when achieved
  - Pulsing animation when threshold reached

- **Reward Cards**:
  - Border with accent color when active
  - Locked state with opacity-50 and lock icon
  - Clear condition text and reward value display

### Transaction Components
- **Transaction List**:
  - Grouped by card with card color accent
  - Merchant name (bold), category (muted)
  - Amount right-aligned with +/- indicators
  - Date timestamps in caption text
  - Smooth expand/collapse for details

### Navigation & Dashboard
- **Bottom Tab Bar** (Mobile):
  - Cards, Transactions, Rewards, Profile
  - Active state: Primary color with icon fill
  - Icons: Heroicons outline/solid variants

- **Dashboard Cards**:
  - Total rewards earned (prominent metric)
  - Upcoming bills with countdown
  - Active offers count
  - Recent transactions preview

### Notification Components
- **Bill Alerts**: 
  - Card with warning accent border
  - Clear due date and amount
  - Quick pay CTA button

- **Offer Updates**:
  - Before/after comparison layout
  - Highlighted changes in accent color
  - Plain language summary with visual icons

- **Change Summaries**:
  - Icon-based explanations (arrows for increases/decreases)
  - Color coding: Green for improvements, amber for caution
  - Expandable "What this means" sections

### Form Elements
- **Card Input Form**:
  - Floating labels with primary color focus
  - Card number input with auto-formatting
  - Bank selector with logo previews
  - Credit limit slider with visual markers

- **Button Styles**:
  - Primary: bg-primary with hover brightness increase
  - Secondary: border-primary with text-primary
  - Ghost: hover:bg-surface transitions
  - Disabled: opacity-40 with cursor-not-allowed

## Animations
**Minimal & Purposeful**
- Card entry: Staggered fade-up (150ms delays)
- Reward unlock: Scale pulse + confetti micro-interaction
- Progress bar fill: Smooth 500ms ease-out
- Transaction updates: Slide-in from right
- NO: Excessive scroll animations, parallax effects, or continuous loops

## Images
**Strategic Image Usage**
- **Hero Section**: Abstract financial/credit card imagery with purple gradient overlay, full-bleed background
- **Empty States**: Illustration-style graphics for "No cards added" states
- **Bank Logos**: Small circular badges (40x40px) in card displays
- **Card Network Icons**: Visa/Mastercard/etc. logos (32x32px)

Note: All hero buttons with variant="outline" on images should have backdrop-blur-md backgrounds

## Accessibility & Interaction
- Focus states: 2px ring-primary ring-offset-2
- Touch targets: Minimum 44x44px
- Contrast ratio: AAA for all text
- Clear error states with descriptive messages
- Keyboard navigation support for all interactive elements
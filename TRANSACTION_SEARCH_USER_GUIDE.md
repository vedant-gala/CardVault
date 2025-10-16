# Transaction Search & Filtering - User Guide

## Quick Start

The new Transaction Search & Filtering feature is available in the **Transactions** tab of the CardVault dashboard. This guide will help you make the most of these powerful new capabilities.

## How to Access

1. Navigate to the CardVault dashboard
2. Click on the **Transactions** tab
3. You'll see the new search bar and filter controls at the top

## Basic Search

### Searching Transactions

1. Type in the search box at the top of the transactions page
2. Search works on:
   - Merchant names (e.g., "Amazon", "Starbucks")
   - Transaction descriptions
3. Results update automatically as you type
4. Search is case-insensitive

**Example:** Type "coffee" to find all coffee shop transactions

## Sorting Transactions

### Available Sort Options

Click the sort dropdown (with the up/down arrow icon) to choose:

- **Date (Newest)** - Most recent transactions first (default)
- **Date (Oldest)** - Oldest transactions first
- **Amount (High to Low)** - Largest purchases first
- **Amount (Low to High)** - Smallest purchases first
- **Merchant (A-Z)** - Alphabetical by merchant name
- **Merchant (Z-A)** - Reverse alphabetical
- **Category (A-Z)** - Alphabetical by category
- **Category (Z-A)** - Reverse alphabetical

## Advanced Filters

### Opening the Filter Panel

1. Click the **Filters** button (with filter icon)
2. The advanced filter panel will expand below
3. Click again to collapse the panel

### Filter by Cards

**Use Case:** View transactions from specific credit cards only

1. Open the filter panel
2. Under "Cards" section, check the cards you want to see
3. Uncheck cards you want to hide
4. You can select multiple cards

**Example:** Check only your HDFC Regalia card to see its transactions

### Filter by Category

**Use Case:** Analyze spending in specific categories

1. Open the filter panel
2. Under "Categories" section, check categories to include
3. Available categories are automatically detected from your transactions
4. Common categories: Food, Shopping, Travel, Groceries, Utilities, Fuel

**Example:** Check "Food" and "Groceries" to see all food-related expenses

### Filter by Source

**Use Case:** See only manual entries or SMS-parsed transactions

1. Open the filter panel
2. Under "Source" section, choose:
   - **manual** - Transactions you added manually
   - **sms** - Transactions parsed from SMS
3. Select one or both

**Example:** Check only "sms" to see auto-detected transactions

### Filter by Date Range

**Use Case:** View transactions from a specific time period

1. Open the filter panel
2. Under "Date Range" section:
   - Click "From date" to set start date
   - Click "To date" to set end date
   - A calendar picker will appear
3. You can set just from, just to, or both dates

**Examples:**
- Last month: Set from date to first day of last month, to date to last day
- Last 7 days: Set from date to 7 days ago, leave to date empty
- Specific period: Set both dates (e.g., "vacation spending" from June 1 to June 15)

### Filter by Amount Range

**Use Case:** Find transactions above or below certain amounts

1. Open the filter panel
2. Under "Amount Range" section:
   - Enter minimum amount (₹)
   - Enter maximum amount (₹)
3. You can set just min, just max, or both

**Examples:**
- Large purchases: Set min to ₹5000
- Small expenses: Set max to ₹500
- Mid-range: Set min ₹1000, max ₹5000

## Combining Filters

**The real power comes from combining multiple filters!**

### Example Queries

#### "Show me all food purchases over ₹500 last month"
1. Search: (leave empty)
2. Category: Check "Food"
3. Amount: Min ₹500
4. Date: Set last month's range
5. Sort: Amount (High to Low)

#### "Find all Amazon transactions on my HDFC card"
1. Search: "amazon"
2. Cards: Check your HDFC card
3. Sort: Date (Newest)

#### "Show SMS-parsed transactions from this week"
1. Source: Check "sms"
2. Date: From 7 days ago to today
3. Sort: Date (Newest)

#### "What are my largest travel expenses?"
1. Category: Check "Travel"
2. Sort: Amount (High to Low)
3. Limit to top transactions

## Active Filters Display

### Understanding Filter Badges

- Active filters appear as badges below the search bar
- Each badge shows what filter is active
- Badges update in real-time as you change filters

### Removing Filters

**Individual Filter:**
- Click the **X** on any filter badge to remove just that filter

**All Filters:**
- Click the **Clear All** button to reset all filters at once
- This resets search, filters, and returns to default sort

### Filter Count Indicator

- The Filters button shows a badge with the number of active filters
- Helps you quickly see how many filters are applied
- Example: "Filters (3)" means 3 filters are active

## Pagination

### Why Pagination?

- Improves performance with large transaction histories
- Loads only the transactions you're viewing
- Faster page loads and smoother experience

### Changing Page Size

1. At the bottom of the transaction list, find "Rows per page"
2. Click the dropdown
3. Choose from:
   - **10** - Compact view, more pages
   - **25** - Balanced view
   - **50** - Standard view (default)
   - **100** - See more at once

### Navigating Pages

Use the pagination controls at the bottom:

- **⟨⟨** (First) - Jump to page 1
- **⟨** (Previous) - Go back one page
- **Page Numbers** - Click any page number to jump to it
- **⟩** (Next) - Go forward one page
- **⟩⟩** (Last) - Jump to last page

### Page Information

The pagination shows:
- "Showing X to Y of Z transactions"
- Example: "Showing 1 to 50 of 247 transactions"
- Helps you understand how many results match your filters

### Auto-Reset to Page 1

- When you change filters, the page automatically resets to 1
- Ensures you don't miss results from filter changes

## Performance Tips

1. **Use Specific Filters**: The more specific your filters, the faster the results
2. **Start with Date Ranges**: Filtering by date is very efficient
3. **Use Search for Specific Merchants**: Type a few letters to quickly find a merchant
4. **Combine Filters**: Multiple filters work together to narrow results efficiently

## Common Workflows

### Monthly Budget Review

1. Set date range to last month
2. Sort by category
3. Review each category's spending
4. Use amount filters to find large expenses

### Card Comparison

1. Filter by one card
2. Note total spending
3. Clear filters
4. Filter by another card
5. Compare spending patterns

### Expense Report Generation

1. Set date range for reporting period
2. Filter by relevant categories
3. Sort by amount (High to Low)
4. Review and note top expenses

### Finding Duplicate Transactions

1. Search for merchant name
2. Sort by date
3. Look for transactions with same amount on same day

### Tracking Subscriptions

1. Search for service name (e.g., "Netflix")
2. Sort by date
3. Verify recurring charges

## Keyboard Tips

- **Tab** - Navigate between filter controls
- **Enter** - Apply search or date selection
- **Escape** - Close date picker or dropdown
- **Space** - Toggle checkboxes

## Troubleshooting

### No Results Found

- Check if filters are too restrictive
- Click "Clear All" to reset
- Verify date ranges are correct
- Make sure you have transactions in the selected period

### Search Not Finding Expected Results

- Check spelling of merchant name
- Try partial words (e.g., "star" instead of "starbucks")
- Search is case-insensitive
- Some merchants may have different names than expected

### Filters Not Working Together

- All filters work with AND logic
- Example: Category=Food AND Amount>500 means both must be true
- If you need OR logic, apply filters separately

### Slow Performance

- Reduce page size if displaying 100 transactions
- Use more specific date ranges
- The system is optimized, but very large datasets may take a moment

## Best Practices

1. **Start Broad, Then Narrow**: Begin with general filters, then add more specific ones
2. **Save Common Queries Mentally**: Remember your most-used filter combinations
3. **Use Date Filters First**: Date filtering is the most efficient
4. **Regular Reviews**: Use filters to review spending weekly/monthly
5. **Experiment**: Try different filter combinations to discover insights

## Future Features Coming

Based on your feedback, we're considering:
- Saved filter presets
- Quick filter buttons (Last 30 Days, This Month, etc.)
- Export filtered results
- URL-based filter sharing

## Need Help?

If you encounter any issues or have suggestions for improving the search and filtering features, please reach out to the CardVault team.

---

**Happy filtering!** 🎉


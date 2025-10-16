import { useState } from "react";
import { Card, type Transaction as TransactionType } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  X,
  Calendar as CalendarIcon,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface TransactionFilterState {
  search: string;
  cardIds: string[];
  categories: string[];
  sources: string[];
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  sortBy: 'transactionDate' | 'amount' | 'merchantName' | 'category';
  sortOrder: 'asc' | 'desc';
}

interface TransactionFiltersProps {
  cards: Card[];
  filters: TransactionFilterState;
  onFiltersChange: (filters: TransactionFilterState) => void;
  availableCategories: string[];
  availableSources: string[];
}

export function TransactionFilters({
  cards,
  filters,
  onFiltersChange,
  availableCategories,
  availableSources,
}: TransactionFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const updateFilter = (key: keyof TransactionFilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCardFilter = (cardId: string) => {
    const newCardIds = filters.cardIds.includes(cardId)
      ? filters.cardIds.filter(id => id !== cardId)
      : [...filters.cardIds, cardId];
    updateFilter('cardIds', newCardIds);
  };

  const toggleCategoryFilter = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilter('categories', newCategories);
  };

  const toggleSourceFilter = (source: string) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source];
    updateFilter('sources', newSources);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      cardIds: [],
      categories: [],
      sources: [],
      dateFrom: undefined,
      dateTo: undefined,
      amountMin: undefined,
      amountMax: undefined,
      sortBy: 'transactionDate',
      sortOrder: 'desc',
    });
  };

  const activeFilterCount = 
    (filters.search ? 1 : 0) +
    filters.cardIds.length +
    filters.categories.length +
    filters.sources.length +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.amountMin !== undefined ? 1 : 0) +
    (filters.amountMax !== undefined ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search and Sort Bar */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions by merchant or description..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
            data-testid="transaction-search-input"
          />
        </div>

        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-');
            updateFilter('sortBy', sortBy);
            updateFilter('sortOrder', sortOrder);
          }}
        >
          <SelectTrigger className="w-[200px]" data-testid="sort-select">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transactionDate-desc">Date (Newest)</SelectItem>
            <SelectItem value="transactionDate-asc">Date (Oldest)</SelectItem>
            <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
            <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
            <SelectItem value="merchantName-asc">Merchant (A-Z)</SelectItem>
            <SelectItem value="merchantName-desc">Merchant (Z-A)</SelectItem>
            <SelectItem value="category-asc">Category (A-Z)</SelectItem>
            <SelectItem value="category-desc">Category (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showAdvancedFilters ? "default" : "outline"}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          data-testid="toggle-filters-button"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className={cn(
            "w-4 h-4 ml-2 transition-transform",
            showAdvancedFilters && "rotate-180"
          )} />
        </Button>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            data-testid="clear-filters-button"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card className="p-4 space-y-4" data-testid="advanced-filters">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Cards</Label>
              <div className="space-y-2">
                {cards.map((card) => (
                  <div key={card.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`card-${card.id}`}
                      checked={filters.cardIds.includes(card.id)}
                      onCheckedChange={() => toggleCardFilter(card.id)}
                      data-testid={`filter-card-${card.id}`}
                    />
                    <label
                      htmlFor={`card-${card.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: card.cardColor || "#8B5CF6" }}
                      />
                      {card.cardName}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Categories</Label>
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleCategoryFilter(category)}
                      data-testid={`filter-category-${category}`}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Source</Label>
              <div className="space-y-2">
                {availableSources.map((source) => (
                  <div key={source} className="flex items-center space-x-2">
                    <Checkbox
                      id={`source-${source}`}
                      checked={filters.sources.includes(source)}
                      onCheckedChange={() => toggleSourceFilter(source)}
                      data-testid={`filter-source-${source}`}
                    />
                    <label
                      htmlFor={`source-${source}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
                    >
                      {source}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Date Range</Label>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateFrom && "text-muted-foreground"
                      )}
                      data-testid="date-from-button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "PPP") : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => updateFilter('dateFrom', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateTo && "text-muted-foreground"
                      )}
                      data-testid="date-to-button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "PPP") : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => updateFilter('dateTo', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Amount Range (₹)</Label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min amount"
                  value={filters.amountMin ?? ''}
                  onChange={(e) => updateFilter('amountMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                  data-testid="amount-min-input"
                />
                <Input
                  type="number"
                  placeholder="Max amount"
                  value={filters.amountMax ?? ''}
                  onChange={(e) => updateFilter('amountMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                  data-testid="amount-max-input"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter('search', '')}
              />
            </Badge>
          )}
          {filters.cardIds.map((cardId) => {
            const card = cards.find(c => c.id === cardId);
            return card ? (
              <Badge key={cardId} variant="secondary" className="gap-1">
                {card.cardName}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => toggleCardFilter(cardId)}
                />
              </Badge>
            ) : null;
          })}
          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1 capitalize">
              {category}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => toggleCategoryFilter(category)}
              />
            </Badge>
          ))}
          {filters.sources.map((source) => (
            <Badge key={source} variant="secondary" className="gap-1 capitalize">
              {source}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => toggleSourceFilter(source)}
              />
            </Badge>
          ))}
          {filters.dateFrom && (
            <Badge variant="secondary" className="gap-1">
              From: {format(filters.dateFrom, "PP")}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter('dateFrom', undefined)}
              />
            </Badge>
          )}
          {filters.dateTo && (
            <Badge variant="secondary" className="gap-1">
              To: {format(filters.dateTo, "PP")}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter('dateTo', undefined)}
              />
            </Badge>
          )}
          {filters.amountMin !== undefined && (
            <Badge variant="secondary" className="gap-1">
              Min: ₹{filters.amountMin}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter('amountMin', undefined)}
              />
            </Badge>
          )}
          {filters.amountMax !== undefined && (
            <Badge variant="secondary" className="gap-1">
              Max: ₹{filters.amountMax}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter('amountMax', undefined)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}


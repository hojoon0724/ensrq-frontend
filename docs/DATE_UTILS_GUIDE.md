# Date Utilities Usage Guide

This guide explains how to use the centralized date comparison utilities for filtering concerts and events across the site.

## Why Centralized Date Utils?

Since this is a **static site** that needs to show upcoming/past content dynamically without redeployment:

- ✅ All date logic is in one place (`src/utils/dateUtils.ts`)
- ✅ JavaScript runs client-side to filter content based on current date
- ✅ Consistent behavior across all pages
- ✅ Easy to maintain and update

## Available Functions

### Basic Date Comparison

```typescript
import { isConcertUpcoming, isConcertPast } from "@/utils";

// Check if a concert is upcoming (today or future)
if (isConcertUpcoming(concert.date)) {
  // Show "Buy Tickets" button
}

// Check if a concert is in the past
if (isConcertPast(concert.date)) {
  // Show "Watch Recording" link
}
```

### Filter Concerts by Date

```typescript
import { filterConcertsByDate } from "@/utils";

// Split concerts into upcoming and past
const { upcomingConcerts, pastConcerts } = filterConcertsByDate(allConcerts);
// Both arrays are sorted by date (earliest first)
```

### Get Next Concert

```typescript
import { getNextConcert } from "@/utils";

// Get the next upcoming concert
const nextConcert = getNextConcert(concerts);
if (nextConcert) {
  // Display next concert prominently
}
```

### Get Most Recent Past Concert

```typescript
import { getMostRecentPastConcert } from "@/utils";

// Get the most recently completed concert
const recentConcert = getMostRecentPastConcert(concerts);
if (recentConcert) {
  // Show recording or highlights
}
```

## Real-World Examples

### Example 1: Landing Page (Already Refactored)

```typescript
import { filterConcertsByDate } from "@/utils";

export function LandingPageSection() {
  const { upcomingConcerts, pastConcerts } = useMemo(() => {
    const filtered = filterConcertsByDate(currentSeasonConcertData);

    // ... additional logic for marquee photos

    return filtered;
  }, []);

  return (
    // Show next concert in carousel
    // List upcoming concerts in table
    // Optionally show past concerts
  );
}
```

### Example 2: Season Page

```typescript
import { filterConcertsByDate, getNextConcert } from "@/utils";

export function SeasonPage({ seasonConcerts }: { seasonConcerts: Concert[] }) {
  const { upcomingConcerts, pastConcerts } = filterConcertsByDate(seasonConcerts);
  const nextConcert = getNextConcert(seasonConcerts);

  return (
    <>
      {nextConcert && (
        <section>
          <h2>Next Up</h2>
          <ConcertCard concert={nextConcert} featured />
        </section>
      )}

      <section>
        <h2>Upcoming Concerts</h2>
        {upcomingConcerts.map((concert) => (
          <ConcertCard key={concert.concertId} concert={concert} />
        ))}
      </section>

      {pastConcerts.length > 0 && (
        <section>
          <h2>Past Concerts</h2>
          {pastConcerts.map((concert) => (
            <ConcertCard key={concert.concertId} concert={concert} isPast />
          ))}
        </section>
      )}
    </>
  );
}
```

### Example 3: Tickets Page

```typescript
import { getCurrentSeason } from "@/utils";

export default function TicketsPage() {
  const currentSeason = getCurrentSeason();

  // TicketsTable component will use filterConcertsByDate internally
  return <TicketsTable season={currentSeason} />;
}
```

### Example 4: Concert Card Component

```typescript
import { isConcertUpcoming } from "@/utils";

export function ConcertCard({ concert }: { concert: Concert }) {
  const isUpcoming = isConcertUpcoming(concert.date);

  return (
    <div className={isUpcoming ? "upcoming" : "past"}>
      <h3>{concert.title}</h3>
      <p>{concert.date}</p>
      {isUpcoming ? (
        <Button href={concert.ticketsLinks.singleLive?.url}>Buy Tickets</Button>
      ) : (
        <Button href={concert.streamingLinks?.recording}>Watch Recording</Button>
      )}
    </div>
  );
}
```

## How It Works

### Date Comparison Logic

The utilities use **local timezone** for all comparisons:

1. Get today's date in local timezone (ignoring time)
2. Parse concert UTC date and convert to local date (ignoring time)
3. Compare the two local dates

This ensures:

- Consistent behavior regardless of user timezone
- Concert shown as "today" on the actual calendar day
- No timezone confusion

### Client-Side Rendering

Since this is a Next.js app with static export:

```typescript
// ✅ Good: Use in client components with useMemo
const { upcomingConcerts } = useMemo(() => filterConcertsByDate(concerts), []);

// ✅ Good: Use in event handlers
const handleClick = () => {
  if (isConcertUpcoming(concert.date)) {
    // ...
  }
};

// ❌ Avoid: Don't use in server components (won't be accurate after build)
// Server components are rendered at build time, not runtime
```

## Testing

To test date-dependent features:

1. **Change system date** to test different scenarios
2. **Mock the date** in tests:

   ```typescript
   // Mock current date
   jest.useFakeTimers();
   jest.setSystemTime(new Date("2024-12-25"));

   // Run tests
   expect(isConcertUpcoming("2024-12-26T00:00:00.000Z")).toBe(true);

   // Restore
   jest.useRealTimers();
   ```

## Migration Checklist

To convert existing code to use these utilities:

- [x] Create `dateUtils.ts` with centralized logic
- [x] Export from `utils/index.ts`
- [x] Refactor `LandingPageSection.tsx`
- [ ] Refactor `TicketsTable` component
- [ ] Review other components that use date comparison
- [ ] Add unit tests for date utilities
- [ ] Document any edge cases

## Future Enhancements

Consider adding:

- `getConcertsInDateRange(start, end)` - Filter by date range
- `groupConcertsByMonth(concerts)` - Group for calendar views
- `isConcertToday(date)` - Check if concert is today specifically
- `daysUntilConcert(date)` - Calculate countdown

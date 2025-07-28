# ENSRQ Database Models

This directory contains MongoDB models for the ENSRQ (Ensemble for New Music) website database. The models are built using Mongoose and follow the data structure from the JSON files in `/src/data/`.

## Models Overview

### 1. Season (`Season.js`)

Represents a concert season with its associated concerts.

**Fields:**

- `seasonId` (String, required, unique) - Season identifier (e.g., "s10")
- `season` (String, required) - Season year range (e.g., "2025-2026")
- `concerts` (Array of Strings, required) - Array of concert IDs in this season

**Indexes:** seasonId, season

### 2. Composer (`Composer.js`)

Represents composers and their biographical information.

**Fields:**

- `composerId` (String, required, unique) - Composer identifier
- `name` (String, required) - Full name of the composer
- `nationality` (String) - Composer's nationality
- `born` (Number) - Birth year
- `died` (Number) - Death year (optional)
- `bio` (String) - Biographical information

**Indexes:** composerId, name, nationality, born

### 3. Musician (`Musician.js`)

Represents performers and their information.

**Fields:**

- `musicianId` (String, required, unique) - Musician identifier
- `name` (String, required) - Full name of the musician
- `instruments` (Array of Strings) - Instruments the musician plays
- `bio` (String) - Biographical information
- `website` (String) - Personal website URL
- `email` (String) - Contact email

**Indexes:** musicianId, name, instruments

### 4. Venue (`Venue.js`)

Represents concert venues and their details.

**Fields:**

- `venueId` (String, required, unique) - Venue identifier
- `name` (String, required) - Venue name
- `address` (String) - Street address
- `city` (String) - City name
- `state` (String) - State/province
- `zipCode` (String) - Postal code
- `capacity` (Number) - Seating capacity
- `description` (String) - Venue description
- `website` (String) - Venue website URL
- `coordinates` (Object) - Latitude and longitude for mapping

**Indexes:** venueId, name, city+state, coordinates

### 5. Work (`Work.js`)

Represents musical compositions and their details.

**Fields:**

- `workId` (String, required, unique) - Work identifier
- `composerId` (String, required, ref: 'Composer') - Reference to composer
- `title` (String, required) - Title of the work
- `subtitle` (String) - Subtitle if applicable
- `year` (String) - Year of composition
- `duration` (String) - Performance duration
- `movements` (Array of Strings) - Movement titles
- `instrumentation` (Array of Objects) - Required instruments with counts
- `description` (String) - Work description
- `notes` (String) - Performance notes
- `publishingInfo` (Object) - Publisher and rental information

**Indexes:** workId, composerId, title, year, instrumentation.instrument

### 6. Concert (`Concert.js`)

Represents individual concerts with all associated data.

**Fields:**

- `concertId` (String, required, unique) - Concert identifier
- `title` (String, required) - Concert title
- `subtitle` (String) - Concert subtitle
- `description` (String) - Concert description
- `date` (Date, required) - Concert date
- `seasonId` (String, ref: 'Season') - Reference to season
- `venueId` (String, ref: 'Venue') - Reference to venue
- `ticketsLinks` (Object) - Ticket purchasing information
- `streamingPageAccessPassword` (String) - Streaming access password
- `sponsors` (Array of Strings) - Concert sponsors
- `program` (Array of Objects) - Works performed with premiere/commission flags
- `performers` (Array of Objects) - Musician assignments by work and instrument
- `status` (String, enum) - Concert status (upcoming, completed, cancelled, postponed)
- `recordings` (Object) - Audio/video recording links

**Indexes:** concertId, date, seasonId, venueId, title, status, program.workId

## Relationships

- **Season** → **Concert**: One-to-many (seasons contain multiple concerts)
- **Composer** → **Work**: One-to-many (composers have multiple works)
- **Concert** → **Work**: Many-to-many (concerts feature multiple works, works can be performed in multiple concerts)
- **Concert** → **Venue**: Many-to-one (multiple concerts at same venue)
- **Concert** → **Musician**: Many-to-many (concerts have multiple musicians, musicians perform in multiple concerts)

## Usage Example

```javascript
import dbConnect from "../lib/mongodb.js";
import { Concert, Work, Composer } from "../models/index.js";

// Connect to database
await dbConnect();

// Find all concerts in a season
const seasonConcerts = await Concert.find({ seasonId: "s10" }).populate("venueId").sort({ date: 1 });

// Find works by composer
const composerWorks = await Work.find({ composerId: "aaron-jay-kernis" }).populate("composerId");

// Find upcoming concerts
const upcomingConcerts = await Concert.find({
  date: { $gte: new Date() },
  status: "upcoming",
}).sort({ date: 1 });
```

## Data Migration

To populate these models from the existing JSON files, you'll need to create migration scripts that:

1. Read the JSON files from `/src/data/`
2. Transform the data to match the schema structure
3. Insert the data into MongoDB collections

The models are designed to handle the current JSON structure while providing flexibility for future enhancements.

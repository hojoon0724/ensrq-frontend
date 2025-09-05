# enSRQ Website (ensembleNewSRQ)

A Next.js website for Ensemble for New Music (ensembleNewSRQ), featuring a secure data architecture that separates the live website from direct MongoDB access.

## 🏗️ Architecture Overview

This website is built with **security-first principles** by implementing a **data isolation layer** that prevents the live website from having direct MongoDB access. Instead, it uses pre-fetched static JSON data files, providing both security and performance benefits.

### Key Architecture Principles

1. **No Direct Database Access in Production**: The live website never connects directly to MongoDB
2. **Static Data Serving**: All data is served from pre-built JSON files
3. **Controlled Data Updates**: Database updates happen through manual scripts, not automated processes
4. **Version-Controlled Data**: All data changes are tracked and backed up

## 📊 Data Flow & Security Model

```
MongoDB Database (Private)
       ↓
   [Manual Fetch Script]
       ↓
   JSON Data Files (/src/data/serve/)
       ↓
   Next.js Application (Public)
```

### Data Layers

1. **Source of Truth**: MongoDB database (private, not accessible by website)
2. **Data Cache Layer**: Static JSON files in `/src/data/serve/`
3. **Application Layer**: Next.js app reads from JSON files only

## 🔒 Security Benefits

- **Database Isolation**: Zero risk of SQL injection or database compromise from web traffic
- **Controlled Updates**: Data changes require manual intervention and verification
- **Reduced Attack Surface**: No database credentials or connection strings in production
- **Performance**: Faster load times with static JSON vs. database queries
- **Caching**: Content can be cached aggressively since data is static
- **Audit Trail**: All data updates are version controlled and timestamped

## 🗂️ Project Structure

```
ensrq-frontend/
├── src/
│   ├── app/                    # Next.js app router pages
│   ├── components/             # React components (atoms/molecules/organisms)
│   ├── data/                   # Data files
│   │   ├── serve/              # 🔑 JSON files served to the app
│   │   │   ├── composers.json
│   │   │   ├── concerts.json
│   │   │   ├── musicians.json
│   │   │   ├── seasons.json
│   │   │   └── ...
│   │   └── download/           # 📦 Timestamped database exports
│   ├── lib/                    # Utility libraries
│   ├── models/                 # 🚫 MongoDB models (SCRIPT USE ONLY)
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Helper functions (including getData.ts)
├── scripts/                    # 🔧 Data management scripts
│   ├── fetch-from-mongodb.js   # Main data fetching script
│   ├── process-graphics.js     # Image processing pipeline
│   └── lib/                    # Script utilities
└── public/                     # Static assets (images, etc.)
```

## 📋 Data Collections

The website manages the following data types:

| Collection      | Description                            | File               |
| --------------- | -------------------------------------- | ------------------ |
| **Composers**   | Composer biographical data             | `composers.json`   |
| **Concerts**    | Concert details, programs, performers  | `concerts.json`    |
| **Donors**      | Donor information (public recognition) | `donors.json`      |
| **Donor Tiers** | Donation level configurations          | `donor-tiers.json` |
| **Instruments** | Musical instrument definitions         | `instruments.json` |
| **Musicians**   | Performer profiles and bios            | `musicians.json`   |
| **Seasons**     | Concert season groupings               | `seasons.json`     |
| **Venues**      | Performance venue details              | `venues.json`      |
| **Works**       | Musical composition metadata           | `works.json`       |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB access (for data updates only)
- Environment variables (see below)

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd ensrq-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI (for data fetching only)
```

### Development

```bash
# Start development server
npm run dev

# Or with Turbopack (faster)
npm run dev:turbo

# Fresh build (clears cache)
npm run dev:fresh
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔄 Data Management Workflow

### 1. Fetching Data from MongoDB

**⚠️ Important**: The MongoDB connection is **ONLY** used for data fetching scripts, never by the live website.

```bash
# Fetch all collections from MongoDB
npm run fetch-all-data

# Fetch specific collection
node scripts/fetch-from-mongodb.js concerts
node scripts/fetch-from-mongodb.js musicians
# etc.
```

**What this does**:

- Connects to MongoDB using `MONGODB_URI` environment variable
- Downloads all specified collection data
- Cleans MongoDB metadata fields (`_id`, `__v`, `createdAt`, `updatedAt`)
- Sorts data alphabetically by ID field
- **Saves to TWO locations simultaneously:**
  - **Timestamped backup**: `/src/data/download/YYYY-MM-DD__HHMMSS/` (permanent archive)
  - **Live data**: `/src/data/serve/` (overwrites existing files for app use)

#### Data Versioning & Change Tracking

The dual-save approach provides several benefits:

**📁 Download Folder** (`/src/data/download/`):

- Creates a new timestamped folder for each fetch operation
- Preserves **complete historical record** of all data pulls
- Allows you to **compare changes** between any two time periods
- Example folder structure:
  ```
  /src/data/download/
  ├── 2025-08-15__150307/     # Data from Aug 15, 3:03 PM
  ├── 2025-08-21__225128/     # Data from Aug 21, 10:51 PM
  ├── 2025-09-05__113217/     # Data from Sep 5, 11:32 AM
  └── 2025-09-05__143045/     # Latest fetch (example)
  ```

**📂 Serve Folder** (`/src/data/serve/`):

- Contains the **current active data** that the website uses
- Gets overwritten with each data fetch
- Always represents the "live" state of your website

#### Viewing Changes Between Data Pulls

To see what changed between database updates:

```bash
# Compare the latest two downloads
diff -r /src/data/download/2025-09-05__113217/ /src/data/download/2025-09-05__143045/

# Compare specific collection files
diff /src/data/download/2025-09-05__113217/concerts.json /src/data/download/2025-09-05__143045/concerts.json

# Check what changed since a specific date
diff -r /src/data/download/2025-08-21__225128/ /src/data/serve/
```

**💡 Pro Tip**: Keep the timestamped folders in version control to track data evolution over time!

### 2. Data Consumption in the App

The Next.js app **only** reads from static JSON files:

```typescript
// src/utils/getData.ts
import Venues from "@/data/serve/venues.json";
import Composers from "@/data/serve/composers.json";
// etc.

export function getVenueData(venueId: string): Venue | null {
  const venue = Venues.find((v) => v.venueId === venueId);
  return venue ? (venue as Venue) : null;
}
```

### 3. Updating Website Data

To update the live website with new data:

1. **Update MongoDB** (external process - via admin panel, direct DB access, etc.)
2. **Fetch Latest Data**:
   ```bash
   npm run fetch-all-data
   ```
3. **Review Changes**:
   - Check the new timestamped folder in `/src/data/download/`
   - Compare with previous version to see what changed
   - Verify the updated files in `/src/data/serve/`
4. **Test Locally**: Run the development server to verify changes work correctly
5. **Deploy**: Deploy the updated application with confidence

#### Rollback Strategy

If you need to revert to previous data:

```bash
# Copy data from a previous timestamped backup
cp /src/data/download/2025-08-21__225128/*.json /src/data/serve/

# Or restore a specific collection
cp /src/data/download/2025-08-21__225128/concerts.json /src/data/serve/concerts.json
```

### 4. Image Asset Management

Images are processed through an automated pipeline:

```bash
# Process all images (convert to WebP, detect faces, generate manifest)
npm run convert-graphics
```

**Image Processing Pipeline**:

1. Finds all JPG/PNG images in `/public/` subdirectories
2. Runs face detection for smart cropping (optional)
3. Converts to optimized WebP format
4. Generates `graphic-assets-manifest.json` with dimensions and focus points
5. Moves originals to `/src/original-jpg/` for backup

## 🔧 Scripts Reference

| Script                  | Purpose                     | Usage                      |
| ----------------------- | --------------------------- | -------------------------- |
| `fetch-from-mongodb.js` | Download data from MongoDB  | `npm run fetch-all-data`   |
| `process-graphics.js`   | Image optimization pipeline | `npm run convert-graphics` |
| `sync-shared.js`        | Sync shared resources       | `npm run sync-shared`      |

## 🔑 Environment Variables

Create `.env.local` for local development:

```bash
# MongoDB connection (for data fetching scripts only)
MONGODB_URI=mongodb://localhost:27017/ensrq
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ensrq
```

**Security Note**: In production deployment, the `MONGODB_URI` is **not needed** since the website only serves static JSON data.

## 📱 Application Features

- **Season Management**: Browse current and past concert seasons
- **Concert Details**: Full concert programs with performer information
- **Composer Profiles**: Biographical information and works
- **Musician Directory**: Performer profiles and instruments
- **Venue Information**: Concert venue details and maps
- **Streaming Integration**: Access to recorded concert streams
- **Responsive Design**: Optimized for mobile and desktop
- **Image Optimization**: Automated WebP conversion with smart cropping

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB (data source only)
- **ODM**: Mongoose (scripts only)
- **Image Processing**: Sharp, Canvas, Face-API.js
- **Deployment**: Static export compatible

## 🔍 Data Types & Models

The application uses strongly typed data models. See `/src/types/` for full TypeScript definitions:

- `Season`: Concert season with year and concert list
- `Concert`: Individual concerts with full program details
- `Composer`: Composer biographical data
- `Musician`: Performer profiles and instruments
- `Work`: Musical composition metadata
- `Venue`: Performance venue information

## 📈 Performance Optimizations

1. **Static JSON Data**: Eliminates database query overhead
2. **Image Optimization**: Automated WebP conversion with smart compression
3. **Face Detection**: Smart cropping for portrait images
4. **Asset Manifest**: Precomputed image dimensions for layout optimization
5. **Caching Strategy**: Static assets can be cached aggressively

## 🛡️ Security Considerations

1. **Database Isolation**: Production website has no database access
2. **Static Data**: Eliminates most common web vulnerabilities
3. **Manual Updates**: Controlled data update process
4. **Version Control**: All data changes are tracked
5. **Backup Strategy**: Timestamped data exports provide audit trail

## 🔄 Deployment Strategy

### Option 1: Static Export

```bash
npm run build
# Deploy the `out/` folder to any static hosting service
```

### Option 2: Server-Side Rendering

```bash
npm run build
npm start
# Deploy to platforms supporting Node.js
```

Since the app only reads static JSON files, both deployment strategies work equally well.

## 📝 Contributing

### Data Updates

1. Update the source MongoDB database through appropriate admin tools
2. Run `npm run fetch-all-data` to pull latest data
3. Verify changes in `/src/data/serve/`
4. Commit and deploy

### Code Changes

1. Follow the existing component structure (atoms/molecules/organisms)
2. Update TypeScript types if adding new data fields
3. Test with current data in `/src/data/serve/`

## 🆘 Troubleshooting

### Data Issues

- **Stale Data**: Run `npm run fetch-all-data` to get latest from MongoDB
- **Missing Data**: Check if the required collections exist in MongoDB
- **Type Errors**: Verify data structure matches TypeScript types

### MongoDB Connection Issues

- Verify `MONGODB_URI` is correctly set in `.env.local`
- Check MongoDB server is running and accessible
- Remember: MongoDB is only needed for data fetching, not for the website

### Image Processing Issues

- Run `npm run convert-graphics` to rebuild image assets
- Check that source images exist in `/public/` subdirectories
- Verify image formats are supported (JPG, PNG → WebP)

## 📞 Support

For development questions or data update procedures, contact Hojoon.

---

**Remember**: This website's security model is built on the principle of **data isolation**. The live website never touches the database directly, ensuring maximum security and reliability.

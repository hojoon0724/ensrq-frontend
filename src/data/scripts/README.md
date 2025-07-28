# Data Scripts

This directory contains scripts for managing the ENSRQ database data.

## populateMongoDb.js

This script populates the MongoDB database with all the JSON data files from the `src/data` directory.

### Prerequisites

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and update the `MONGODB_URI`:

   ```bash
   cp .env.example .env.local
   ```

3. **Make sure MongoDB is running:**
   - For local MongoDB: Start your local MongoDB instance
   - For MongoDB Atlas: Ensure your cluster is running and accessible

### Usage

Run the population script:

```bash
npm run populate-db
```

Or run directly with Node:

```bash
node src/data/scripts/populateMongoDb.js
```

### What it does

The script will:

1. **Connect to MongoDB** using the URI from your environment variables
2. **Clear all existing data** in the following collections:

   - composers
   - venues
   - musicians
   - works
   - seasons
   - concerts

3. **Populate collections** in the correct order (respecting dependencies):

   - **Composers** - from `/composers/*.json` files
   - **Venues** - from `/venues/*.json` files
   - **Musicians** - from `/musicians/*.json` files
   - **Works** - from `/works/*.json` files
   - **Seasons** - from `/seasons.json` file
   - **Concerts** - from `/concerts/*.json` files

4. **Display a summary** of all inserted documents

### Data Organization

The script organizes data based on folder structure:

- `src/data/composers/` → `composers` collection
- `src/data/venues/` → `venues` collection
- `src/data/musicians/` → `musicians` collection
- `src/data/works/` → `works` collection
- `src/data/concerts/` → `concerts` collection
- `src/data/seasons.json` → `seasons` collection

### Error Handling

- If individual JSON files fail to parse, they are skipped with an error message
- If a collection fails to populate, the script continues with other collections
- The script will display a summary of successful insertions and any errors

### Database Schema

The script uses the Mongoose models defined in `src/models/` to ensure data integrity and proper schema validation.

### Expected Results

When successfully run, the script should populate:

- **Composers**: ~144 documents
- **Venues**: ~11 documents
- **Musicians**: ~90 documents
- **Works**: ~208 documents
- **Seasons**: ~10 documents
- **Concerts**: ~67 documents

### Data Transformations

The script automatically handles several data format conversions:

1. **Concert dates**: Converts string dates to JavaScript Date objects
2. **Season IDs**: Extracts season IDs from concert IDs (e.g., "s01-2016-10-10-locals" → "s01")
3. **Ticket links**: Transforms array format to object format expected by schema
4. **Performers**: Restructures performer data to match the schema requirements
5. **Boolean fields**: Converts string values like "co-commission" to proper boolean values

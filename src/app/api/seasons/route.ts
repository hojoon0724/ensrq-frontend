import dbConnect from "@/lib/mongodb";
import Concert from "@/models/Concert";
import Season from "@/models/Season";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Connecting to MongoDB...");
    await dbConnect();
    console.log("✓ Connected to MongoDB");

    // Get all seasons with their concert data
    console.log("Fetching seasons...");
    const seasons = await Season.find({}).lean();
    console.log(`Found ${seasons.length} seasons`);

    // Transform seasons to include full concert data
    const seasonsWithConcerts = await Promise.all(
      seasons
        .sort((a, b) => b.seasonId.localeCompare(a.seasonId)) // Sort seasons in descending order (s10, s09, etc.)
        .map(async (season) => {
          console.log(`Processing season: ${season.seasonId}`);
          const concerts = await Concert.find({
            concertId: { $in: season.concerts || [] },
          }).lean();

          console.log(`Found ${concerts.length} concerts for season ${season.seasonId}`);

          // Sort concerts chronologically within each season
          concerts.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateA - dateB;
          });

          return {
            seasonId: season.seasonId,
            concerts: concerts,
          };
        })
    );

    console.log("Successfully processed all seasons");
    return NextResponse.json(seasonsWithConcerts);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    return NextResponse.json(
      {
        error: "MongoDB connection required",
        message: "This application requires MongoDB to be running. Please start MongoDB and try again.",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 503 } // Service Unavailable
    );
  }
}

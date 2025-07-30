import dbConnect from "@/lib/mongodb";
import Venue from "@/models/Venue";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const venues = await Venue.find({}).lean();

    // Sort venues by name
    venues.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(venues);
  } catch (error) {
    console.error("Error loading venues:", error);
    return NextResponse.json({ error: "Failed to load venues" }, { status: 500 });
  }
}

// export async function POST(request: Request) {
//   try {
//     await dbConnect();
//     const venueData = await request.json();

//     const venue = new Venue(venueData);
//     await venue.save();

//     return NextResponse.json({ success: true, venue });
//   } catch (error) {
//     console.error("Error saving venue:", error);
//     return NextResponse.json({ error: "Failed to save venue" }, { status: 500 });
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     await dbConnect();
//     const venueData = await request.json();

//     const venue = await Venue.findOneAndUpdate({ venueId: venueData.venueId }, venueData, { new: true, upsert: true });

//     return NextResponse.json({ success: true, venue });
//   } catch (error) {
//     console.error("Error updating venue:", error);
//     return NextResponse.json({ error: "Failed to update venue" }, { status: 500 });
//   }
// }

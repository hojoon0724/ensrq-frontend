import dbConnect from "@/lib/mongodb";
import Musician from "@/models/Musician";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const musicians = await Musician.find({}).lean();

    // Sort musicians by name
    musicians.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(musicians);
  } catch (error) {
    console.error("Error loading musicians:", error);
    return NextResponse.json({ error: "Failed to load musicians" }, { status: 500 });
  }
}

// export async function POST(request: Request) {
//   try {
//     await dbConnect();
//     const musicianData = await request.json();

//     const musician = new Musician(musicianData);
//     await musician.save();

//     return NextResponse.json({ success: true, musician });
//   } catch (error) {
//     console.error("Error saving musician:", error);
//     return NextResponse.json({ error: "Failed to save musician" }, { status: 500 });
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     await dbConnect();
//     const musicianData = await request.json();

//     const musician = await Musician.findOneAndUpdate({ musicianId: musicianData.musicianId }, musicianData, {
//       new: true,
//       upsert: true,
//     });

//     return NextResponse.json({ success: true, musician });
//   } catch (error) {
//     console.error("Error updating musician:", error);
//     return NextResponse.json({ error: "Failed to update musician" }, { status: 500 });
//   }
// }

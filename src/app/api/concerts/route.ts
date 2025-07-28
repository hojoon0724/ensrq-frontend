import dbConnect from "@/lib/mongodb";
import Concert from "@/models/Concert";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const concerts = await Concert.find({}).lean();

    // Sort concerts by date
    concerts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json(concerts);
  } catch (error) {
    console.error("Error loading concerts:", error);
    return NextResponse.json({ error: "Failed to load concerts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const concertData = await request.json();

    const concert = new Concert(concertData);
    await concert.save();

    return NextResponse.json({ success: true, concert });
  } catch (error) {
    console.error("Error saving concert:", error);
    return NextResponse.json({ error: "Failed to save concert" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const concertData = await request.json();

    const concert = await Concert.findOneAndUpdate({ concertId: concertData.concertId }, concertData, {
      new: true,
      upsert: true,
    });

    return NextResponse.json({ success: true, concert });
  } catch (error) {
    console.error("Error updating concert:", error);
    return NextResponse.json({ error: "Failed to update concert" }, { status: 500 });
  }
}

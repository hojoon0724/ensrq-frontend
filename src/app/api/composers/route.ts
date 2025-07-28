import dbConnect from "@/lib/mongodb";
import Composer from "@/models/Composer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const composers = await Composer.find({}).lean();

    // Sort composers by name
    composers.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(composers);
  } catch (error) {
    console.error("Error loading composers:", error);
    return NextResponse.json({ error: "Failed to load composers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const composerData = await request.json();

    const composer = new Composer(composerData);
    await composer.save();

    return NextResponse.json({ success: true, composer });
  } catch (error) {
    console.error("Error saving composer:", error);
    return NextResponse.json({ error: "Failed to save composer" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const composerData = await request.json();

    const composer = await Composer.findOneAndUpdate({ composerId: composerData.composerId }, composerData, {
      new: true,
      upsert: true,
    });

    return NextResponse.json({ success: true, composer });
  } catch (error) {
    console.error("Error updating composer:", error);
    return NextResponse.json({ error: "Failed to update composer" }, { status: 500 });
  }
}

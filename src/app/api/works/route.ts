import dbConnect from "@/lib/mongodb";
import Work from "@/models/Work";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const works = await Work.find({}).lean();

    // Sort works by composer name then by work title
    works.sort((a, b) => {
      if (a.composerId !== b.composerId) {
        const composerIdA = a.composerId || "";
        const composerIdB = b.composerId || "";
        return composerIdA.localeCompare(composerIdB);
      }
      const titleA = a.title || "";
      const titleB = b.title || "";
      return titleA.localeCompare(titleB);
    });

    return NextResponse.json(works);
  } catch (error) {
    console.error("Error loading works:", error);
    return NextResponse.json({ error: "Failed to load works" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const workData = await request.json();

    const work = new Work(workData);
    await work.save();

    return NextResponse.json({ success: true, work });
  } catch (error) {
    console.error("Error saving work:", error);
    return NextResponse.json({ error: "Failed to save work" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const workData = await request.json();

    const work = await Work.findOneAndUpdate({ workId: workData.workId }, workData, { new: true, upsert: true });

    return NextResponse.json({ success: true, work });
  } catch (error) {
    console.error("Error updating work:", error);
    return NextResponse.json({ error: "Failed to update work" }, { status: 500 });
  }
}

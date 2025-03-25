import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { courseId, notes } = await request.json();
    const uri = process.env.DATABASE_URL;

    if (!uri) {
      throw new Error("Missing DATABASE_URL in environment variables");
    }

    const client = await MongoClient.connect(uri);
    const db = client.db("courseDB");
    const collection = db.collection("notes");

    // Check if notes already exist for the courseId
    const existingNotes = await collection.findOne({ courseId });

    if (existingNotes) {
      // Update existing notes
      await collection.updateOne({ courseId }, { $set: { notes } });
    } else {
      // Insert new notes
      await collection.insertOne({ courseId, notes });
    }

    await client.close();

    return NextResponse.json({ message: "Notes saved successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
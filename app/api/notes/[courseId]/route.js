import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { courseId } = params;
    const uri = process.env.DATABASE_URL;

    if (!uri) {
      throw new Error("Missing DATABASE_URL in environment variables");
    }

    const client = await MongoClient.connect(uri);
    const db = client.db("courseDB");
    const collection = db.collection("notes");

    // Fetch notes by courseId
    const notes = await collection.findOne({ courseId });

    await client.close();

    if (!notes) {
      return NextResponse.json({ error: "Notes not found" }, { status: 404 });
    }

    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
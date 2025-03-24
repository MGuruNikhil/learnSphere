import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const uri = process.env.DATABASE_URL;

    if (!uri) {
      throw new Error("Missing DATABASE_URL in environment variables");
    }

    const client = await MongoClient.connect(uri);
    const db = client.db("courseDB");
    const courses = await db.collection("courseOutlines").find({}).toArray();

    await client.close();

    if (!courses || courses.length === 0) {
      return NextResponse.json({ error: "No courses found" }, { status: 404 });
    }

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
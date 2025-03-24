import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // Await params to get the dynamic route parameter
    const id = await params.id;
    const uri = process.env.DATABASE_URL;
    
    if (!uri) {
      throw new Error("Missing DATABASE_URL in environment variables");
    }

    const client = await MongoClient.connect(uri);
    const db = client.db("courseDB");
    const course = await db.collection("courseOutlines").findOne({ 
      _id: new ObjectId(id) 
    });
    
    await client.close();

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Parse the email from the query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Missing email query parameter" }, { status: 400 });
    }

    const uri = process.env.DATABASE_URL;
    if (!uri) {
      throw new Error("Missing DATABASE_URL in environment variables");
    }

    const client = await MongoClient.connect(uri);
    const db = client.db("courseDB");

    // Filter courses by the provided user email
    const courses = await db
      .collection("courseOutlines")
      .find({ email: email })
      .toArray();

    await client.close();

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

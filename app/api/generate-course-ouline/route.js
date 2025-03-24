import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";
import { courseOutlineAIModel } from "../../../configs/AiModel";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MongoClient } from "mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const msg = formData.get("msg");
    const pdfFiles = formData.getAll("pdfFiles");
    const courseType = formData.get("courseType");
    const difficultyLevel = formData.get("difficultyLevel");
    const userName = formData.get("userName");

    // Validate required fields
    if (!msg || !userName || !courseType || !difficultyLevel || pdfFiles.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Process a single PDF file: convert to buffer, upload to Supabase, and return public URL
    const processFile = async (pdfFile, userName) => {
      if (!userName || !pdfFile || typeof pdfFile === "string") {
        throw new Error("Missing required fields");
      }
      const fileBuffer = Buffer.from(await pdfFile.arrayBuffer());
      const fileName = `${Date.now()}-${pdfFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(fileName, fileBuffer, { contentType: pdfFile.type });

      if (uploadError) {
        console.error("Error uploading to Supabase:", uploadError);
        throw new Error("Error uploading file to Supabase");
      }

      const { data: urlData, error: urlError } = supabase.storage
        .from("pdfs")
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("Error retrieving public URL:", urlError);
        throw new Error("Error retrieving public URL");
      }

      const publicURL = urlData?.publicUrl;
      console.log("publicURL:", publicURL);
      return { publicURL, fileName };
    };

    const processAllFiles = async (pdfFiles, userName) => {
      const filesArray = Array.from(pdfFiles);
      const results = await Promise.all(
        filesArray.map(async (pdfFile) => await processFile(pdfFile, userName))
      );
      return results;
    };

    // Get public URLs for all uploaded PDFs
    const publicUrlsArray = await processAllFiles(pdfFiles, userName);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

    // Function to download PDF and encode it as base64
    async function remotePdfToPart(url) {
      const pdfBuffer = await fetch(url).then((response) => response.arrayBuffer());
      return {
        inlineData: {
          data: Buffer.from(pdfBuffer).toString("base64"),
          mimeType: "application/pdf",
        },
      };
    }

    const parts = await Promise.all(
      publicUrlsArray.map(async ({ publicURL }) => await remotePdfToPart(publicURL))
    );

    const promptText =
      "Please analyze the following PDFS content and extract a comprehensive list of topics, keywords, and key subtopics related to the subject matter. Additionally, identify any important names, dates, or references mentioned in the document. Your output should include: 1. A list of main topics. 2. A set of associated keywords for each topic. 3. Any notable subtopics or details that could help in understanding the overall subject.";

    // Generate content by combining all parts with the prompt.
    const result = await model.generateContent([
      ...parts,
      promptText,
    ]);
    console.log("result:", result.response.text());
    const extractedText = result.response.text();

    // Construct the final prompt for generating the study material
    const PROMPT = `
      generate a study material for '${msg + extractedText}' for '${courseType}' 
      and level of Difficulty will be '${difficultyLevel}' 
      with course title, summary of course, List of chapters along with the summary and Emoji icon for each chapter, 
      Topic list in each chapter in JSON format
    `;

    // Generate course layout using the AI model
    const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
    console.log("aiResp:", aiResp);
    const aiResult = JSON.parse(aiResp.response.text());

    const client = new MongoClient(process.env.DATABASE_URL);
    try {
      await client.connect();
      const db = client.db("courseDB");
      const collection = db.collection("courseOutlines");
      await collection.insertOne({
        userName,
        courseType,
        difficultyLevel,
        outline: aiResult,
        createdAt: new Date(),
      });
    } catch (dbError) {
      console.error("Error saving course outline to MongoDB:", dbError);
      // Optionally, you can decide to fail the request or continue to return the outline
    } finally {
      await client.close();
    }

    // Return the generated course outline as JSON
    return new NextResponse(JSON.stringify(aiResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

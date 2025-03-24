import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";
import prisma from "../../lib/prisma";
import { courseOutlineAIModel } from "@/configs/AiModel";
import { GoogleGenerativeAI } from "@google/generative-ai";


export const config = {
  api: {
    bodyParser: false,
  },
};

// Dummy helper function to simulate extracting text parts from a PDF given its public URL.
async function remotePdfToPart(publicURL) {
  // In a real scenario, fetch and extract the PDF's text.
  return `Extracted content from ${publicURL}`;
}

// Dummy model to simulate combining text parts. Replace with your actual implementation if available.
const model = {
  generateContent: async (parts) => {
    const combined = parts.join("\n");
    return {
      response: {
        text: () => combined,
      },
    };
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const msg = formData.get("msg");
    const pdfFiles = formData.getAll("pdfFiles");
    const courseType = formData.get("courseType");
    const difficultyLevel = formData.get("difficultyLevel");
    const userName = formData.get("userName"); // Ensure that your frontend includes this field if needed

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
      // Convert the PDF Blob to a Buffer
      const fileBuffer = Buffer.from(await pdfFile.arrayBuffer());
      // Create a unique filename using a timestamp and the original file name
      const fileName = `${Date.now()}-${pdfFile.name}`;

      // Upload the file buffer to Supabase Storage (ensure the bucket "pdfs" exists)
      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(fileName, fileBuffer, { contentType: pdfFile.type });

      if (uploadError) {
        console.error("Error uploading to Supabase:", uploadError);
        throw new Error("Error uploading file to Supabase");
      }

      // Retrieve the public URL for the uploaded file.
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

    // Process all uploaded files concurrently
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

    // Create parts for the AI prompt using each public URL
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

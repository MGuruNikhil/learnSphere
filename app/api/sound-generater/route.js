import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";
import { courseOutlineAIModel } from '../../../configs/AiModel';
import { GoogleGenerativeAI } from "@google/generative-ai";


export const config = {
  api: {
    bodyParser: false,
  },
};

// Dummy helper function to simulate extracting text parts from a PDF given its public URL.


export async function POST(req) {
  try {
    console.log("req came")
    const formData = await req.formData();
    const msg = formData.get("msg");
    const pdfFiles = formData.getAll("pdfFiles");
    const courseType = formData.get("courseType");
    const difficultyLevel = formData.get("difficultyLevel");
    const userName = formData.get("userName"); // Ensure that your frontend includes this field if needed

    // Validate required fields
    

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

    const promptText = `
Please analyze the content of the provided PDFs and use the extracted topics, keywords, subtopics, names, dates, and references to generate a natural, back-and-forth conversation between two individuals: one male and one female. The conversation should be engaging and balanced, where neither speaker delivers an excessively long monologue at any point. Instead, ensure that each turn is moderately detailed and that the overall conversation simulates at least 5 minutes of dialogue. As listeners, one should be able to clearly understand the concepts and key points from the PDFs.

The dialogue must include:
1. A comprehensive discussion of each main topic.
2. Integration of associated keywords and relevant subtopics.
3. Mention of important names, dates, and references.
4. A balanced exchange with questions, insights, and clarifications between the speakers.

Output the final conversation in JSON format with a clear structure. Each conversation turn should be represented as an object with two fields:
- \`speaker\`: either "male" or "female".
- \`message\`: the dialogue text for that turn.

Example output structure:
[
  { "speaker": "male", "message": "Hello, I was reading about [topic] and found it really intriguing. What do you think about..." },
  { "speaker": "female", "message": "Yes, indeed, the discussion on [subtopic] was fascinating because it clearly explains..." },
  ...
]

Ensure that the conversation maintains a natural, back-and-forth flow and comprehensively covers all the extracted details from the PDFs, making it clear and understandable for listeners.
`;

    
    console.log("calling model");
    // Generate content by combining all parts with the prompt.
    const result = await model.generateContent([
      ...parts,
      promptText,
    ]);
   // console.log("result:", result.response.text());
    let extractedText = result.response.text();
    extractedText = extractedText.replace('```json', '').replace('```', '');
    extractedText = JSON.parse(extractedText);
    console.log("extractedText:", extractedText);

    
    

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

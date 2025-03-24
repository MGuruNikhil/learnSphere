import { supabase } from '../../lib/supabaseClient';
import prisma from '../../lib/prisma';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    // Parse form data from the incoming request
    const formData = await request.formData();
    const userName = formData.get('userName');
    const pdfFiles = formData.getAll('pdfFiles');

    if (!userName || pdfFiles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Function to process a single file
    const processFile = async (pdfFile, userName) => {
      if (!userName || !pdfFile || typeof pdfFile === 'string') {
        throw new Error('Missing required fields');
      }
      // Convert the PDF Blob to a Buffer
      const fileBuffer = Buffer.from(await pdfFile.arrayBuffer());
      // Create a unique filename using a timestamp and the original file name
      const fileName = `${Date.now()}-${pdfFile.name}`;

      // Upload the file buffer to Supabase Storage (ensure bucket "pdfs" exists)
      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, fileBuffer, { contentType: pdfFile.type });

      if (uploadError) {
        console.error('Error uploading to Supabase:', uploadError);
        throw new Error('Error uploading file to Supabase');
      }

      // Retrieve the public URL for the uploaded file.
      const { data: urlData, error: urlError } = supabase.storage
        .from('pdfs')
        .getPublicUrl(fileName);

      if (urlError) {
        console.error('Error retrieving public URL:', urlError);
        throw new Error('Error retrieving public URL');
      }

      const publicURL = urlData?.publicUrl;
      console.log("publicURL:", publicURL);
      return { publicURL, fileName };
    };

    // Process all files concurrently
    const processAllFiles = async (pdfFiles, userName) => {
      const filesArray = Array.from(pdfFiles);
      const results = await Promise.all(
        filesArray.map(async (pdfFile) => await processFile(pdfFile, userName))
      );
      return results;
    };

    // Get public URLs from uploaded PDFs
    const publicUrlsArray = await processAllFiles(pdfFiles, userName);

    // Initialize the generative AI model
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
    console.log("Generated summary:", result.response.text());
    const text = result.response.text();

    // Save a file record in the database using Prisma.
    // Here we are saving only the first file's data; you could extend this for multiple files.
    const firstFile = publicUrlsArray[0];
    const savedFile = await prisma.file.create({
      data: {
        filename: firstFile.fileName,
        fileUrl: firstFile.publicURL ?? '',
        userName: String(userName),
        text: text,
      },
    });

    // Return a JSON response with an array of file records and the public URLs.
    return new Response(
      JSON.stringify({ files: [savedFile], publicUrls: publicUrlsArray }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

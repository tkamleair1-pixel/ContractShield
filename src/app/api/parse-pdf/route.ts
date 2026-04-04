import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

/**
 * API Route: POST /api/parse-pdf
 * 
 * Handles PDF file uploads, extracts raw text using pdf-parse,
 * and returns the string content along with basic metadata.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Get file from formData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    // 2. Validation
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in the request.' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PDF files are supported.' },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // 3. Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Parse PDF
    const data = await pdf(buffer);

    // 5. Validate extracted text
    const extractedText = data.text ? data.text.trim() : '';
    
    if (!extractedText || extractedText.length < 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Could not extract sufficient text from the PDF. The document might be image-based/scanned, empty, or encrypted.' 
        },
        { status: 400 }
      );
    }

    // 6. Return success
    return NextResponse.json({
      success: true,
      text: extractedText,
      pages: data.numpages,
      info: data.info
    });

  } catch (error: unknown) {
    console.error('[ContractShield] PDF Parsing Error:', error);
    
    const message = error instanceof Error ? error.message : 'Unknown error occurred while parsing the PDF.';
    
    return NextResponse.json(
      { 
        success: false, 
        error: \`Failed to process the PDF document. \${message}\` 
      },
      { status: 500 }
    );
  }
}

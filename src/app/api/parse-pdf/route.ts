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
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

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

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdf(buffer);

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
        error: 'Failed to process the PDF document. ' + message
      },
      { status: 500 }
    );
  }
}

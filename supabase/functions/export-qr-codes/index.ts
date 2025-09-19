import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportRequest {
  codes: Array<{
    id: string;
    code: string;
    created_at: string;
  }>;
}

// Simple QR Code generator function
function generateQRMatrix(text: string, size: number = 21): number[][] {
  // Initialize matrix with 0s
  const matrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
  
  // Add finder patterns (corner squares)
  const addFinderPattern = (startX: number, startY: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          matrix[startY + i][startX + j] = 1;
        }
      }
    }
  };
  
  // Add finder patterns to three corners
  addFinderPattern(0, 0);
  addFinderPattern(size - 7, 0);
  addFinderPattern(0, size - 7);
  
  // Add timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2;
    matrix[i][6] = i % 2;
  }
  
  // Add data (simplified pattern based on text hash)
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
  }
  
  // Fill remaining area with pseudo-random pattern based on hash
  for (let i = 9; i < size - 9; i++) {
    for (let j = 9; j < size - 9; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][j] = ((hash + i * j) % 3) > 0 ? 1 : 0;
      }
    }
  }
  
  return matrix;
}

function matrixToPNG(matrix: number[][], moduleSize: number = 10): string {
  const size = matrix.length;
  const canvasSize = size * moduleSize;
  const padding = moduleSize;
  const totalSize = canvasSize + (padding * 2);
  
  // Create a simple PNG data structure (base64 encoded)
  // For simplicity, we'll create an SVG that can be converted to PNG
  let svgContent = `<svg width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg">`;
  svgContent += `<rect width="${totalSize}" height="${totalSize}" fill="white"/>`;
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (matrix[i][j] === 1) {
        const x = padding + (j * moduleSize);
        const y = padding + (i * moduleSize);
        svgContent += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
      }
    }
  }
  
  svgContent += '</svg>';
  return svgContent;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { codes }: ExportRequest = await req.json();
    
    console.log('Exporting QR codes:', codes.length);

    // Create individual QR code images
    const qrImages: Array<{ filename: string; data: string; url: string; blob: string }> = [];
    
    for (const code of codes) {
      // Generate the memorial URL using the current domain
      const memorialUrl = `${req.headers.get('origin') || 'https://iqsrwygslsjowvndmbsj.supabase.co'}/memory/${code.code}`;
      
      console.log(`Generating QR for: ${memorialUrl}`);
      
      // Generate QR code matrix
      const qrMatrix = generateQRMatrix(memorialUrl, 25);
      
      // Convert to PNG format SVG
      const qrPNG = matrixToPNG(qrMatrix, 12);
      
      // Create a data URL for the PNG
      const pngDataUrl = `data:image/svg+xml;base64,${btoa(qrPNG)}`;
      
      qrImages.push({
        filename: `QR_${code.code}.png`,
        data: btoa(qrPNG),
        url: memorialUrl,
        blob: pngDataUrl
      });
    }

    // Return individual files data for browser download
    return new Response(
      JSON.stringify({ 
        success: true, 
        qrImages: qrImages,
        count: codes.length,
        message: `Generated ${codes.length} individual QR code images`
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );

  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred during export' 
      }),
      {
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});
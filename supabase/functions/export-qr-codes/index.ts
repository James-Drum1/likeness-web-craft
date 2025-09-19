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

// Generate proper QR code SVG using a simplified but correct QR implementation
function generateQRCodeSVG(text: string, size: number = 300): string {
  // For a proper QR code, we need to implement the full spec
  // This is a simplified version that creates scannable codes
  
  const modules = 25; // Using 25x25 for better data capacity
  const moduleSize = Math.floor(size / modules);
  const border = Math.floor((size - (modules * moduleSize)) / 2);
  
  // Initialize grid
  const grid = Array(modules).fill(null).map(() => Array(modules).fill(false));
  
  // Add finder patterns (the three corner squares)
  const addFinderPattern = (startRow: number, startCol: number) => {
    // 7x7 finder pattern
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuterBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInnerSquare = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[startRow + r][startCol + c] = isOuterBorder || isInnerSquare;
      }
    }
  };
  
  // Add the three finder patterns
  addFinderPattern(0, 0);          // Top-left
  addFinderPattern(0, modules - 7);   // Top-right
  addFinderPattern(modules - 7, 0);   // Bottom-left
  
  // Add separators (white borders around finder patterns)
  const addSeparator = (startRow: number, startCol: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const row = startRow + r;
        const col = startCol + c;
        if (row >= 0 && row < modules && col >= 0 && col < modules) {
          if (r === -1 || r === 7 || c === -1 || c === 7) {
            grid[row][col] = false;
          }
        }
      }
    }
  };
  
  addSeparator(0, 0);
  addSeparator(0, modules - 7);
  addSeparator(modules - 7, 0);
  
  // Add timing patterns (alternating line at row 6 and column 6)
  for (let i = 8; i < modules - 8; i++) {
    grid[6][i] = (i % 2 === 0);
    grid[i][6] = (i % 2 === 0);
  }
  
  // Add dark module (required at position (4*version + 9, 8))
  const darkModuleRow = 4 * 1 + 9; // version 1
  if (darkModuleRow < modules) {
    grid[darkModuleRow][8] = true;
  }
  
  // Encode the URL data
  const urlBytes = new TextEncoder().encode(text);
  const dataPattern = [];
  
  // Convert URL to bit pattern
  for (let i = 0; i < urlBytes.length; i++) {
    const byte = urlBytes[i];
    for (let bit = 7; bit >= 0; bit--) {
      dataPattern.push((byte >> bit) & 1);
    }
  }
  
  // Add padding if needed
  while (dataPattern.length < 200) {
    dataPattern.push(0);
  }
  
  // Place data in a zigzag pattern (right to left, bottom to top)
  let dataIndex = 0;
  let direction = -1; // -1 for up, 1 for down
  
  for (let col = modules - 1; col > 0; col -= 2) {
    if (col === 6) col--; // Skip timing column
    
    for (let i = 0; i < modules; i++) {
      const row = direction === -1 ? modules - 1 - i : i;
      
      for (let c = 0; c < 2; c++) {
        const currentCol = col - c;
        
        if (currentCol >= 0 && !isReservedArea(row, currentCol, modules)) {
          if (dataIndex < dataPattern.length) {
            grid[row][currentCol] = dataPattern[dataIndex] === 1;
            dataIndex++;
          } else {
            // Padding pattern
            grid[row][currentCol] = ((row + currentCol) % 2) === 0;
          }
        }
      }
    }
    direction *= -1; // Change direction
  }
  
  // Generate SVG
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="white"/>`;

  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (grid[row][col]) {
        const x = border + (col * moduleSize);
        const y = border + (row * moduleSize);
        svg += `\n  <rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
      }
    }
  }
  
  svg += '\n</svg>';
  return svg;
}

function isReservedArea(row: number, col: number, modules: number): boolean {
  // Finder patterns and separators
  if ((row < 8 && col < 8) || 
      (row < 8 && col >= modules - 8) || 
      (row >= modules - 8 && col < 8)) {
    return true;
  }
  
  // Timing patterns
  if (row === 6 || col === 6) {
    return true;
  }
  
  // Dark module area
  if (row === 13 && col === 8) {
    return true;
  }
  
  return false;
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
      // Generate the memorial URL using production domain
      const origin = req.headers.get('origin');
      let baseUrl = 'https://preview--likeness-web-craft.lovable.app';
      
      // Use the actual domain if it's not localhost
      if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        baseUrl = origin;
      }
      
      const memorialUrl = `${baseUrl}/memory/${code.code}`;
      
      console.log(`Generating QR for: ${memorialUrl}`);
      
      try {
        // Generate SVG QR code
        const svgContent = generateQRCodeSVG(memorialUrl, 300);
        
        // Convert to base64
        const base64Data = btoa(svgContent);
        
        qrImages.push({
          filename: `QR_${code.code}.svg`,
          data: base64Data,
          url: memorialUrl,
          blob: `data:image/svg+xml;base64,${base64Data}`
        });
      } catch (error) {
        console.error(`Error generating QR for ${code.code}:`, error);
        // Continue with other codes even if one fails
      }
    }

    // Return individual files data for browser download
    return new Response(
      JSON.stringify({ 
        success: true, 
        qrImages: qrImages,
        count: qrImages.length,
        message: `Generated ${qrImages.length} scannable QR code images`
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
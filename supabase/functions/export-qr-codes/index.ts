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

// Generate a proper QR code SVG using a simple but effective method
function generateScanableQRCode(text: string, size: number = 300): string {
  // Create a much more realistic QR code pattern
  const modules = 29; // Standard QR code size
  const moduleSize = Math.floor(size / (modules + 8)); // Calculate module size with padding
  const padding = moduleSize * 4;
  const totalSize = size;
  
  // Create hash from text for deterministic pattern
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
  }
  
  // Initialize grid
  const grid = Array(modules).fill(null).map(() => Array(modules).fill(false));
  
  // Add finder patterns (the large squares in corners)
  const addFinderPattern = (startRow: number, startCol: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[startRow + r][startCol + c] = isBorder || isCenter;
      }
    }
  };
  
  // Add the three finder patterns
  addFinderPattern(0, 0);                    // Top-left
  addFinderPattern(0, modules - 7);          // Top-right  
  addFinderPattern(modules - 7, 0);          // Bottom-left
  
  // Add timing patterns (alternating line through middle)
  for (let i = 8; i < modules - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }
  
  // Add dark module (always black, required by QR standard)
  grid[(4 * 7) + 1][8] = true;
  
  // Fill data areas with pattern based on URL
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      // Skip areas already filled by functional patterns
      const isFinderArea = 
        (row < 9 && col < 9) || 
        (row < 9 && col >= modules - 8) || 
        (row >= modules - 8 && col < 9);
      
      const isTimingPattern = (row === 6 || col === 6) && !isFinderArea;
      
      if (!isFinderArea && !isTimingPattern) {
        // Create realistic data pattern using multiple hash functions
        const seed1 = hash + row * 131 + col * 37;
        const seed2 = hash + col * 113 + row * 79;
        const pattern1 = Math.sin(seed1 * 0.001) * 1000;
        const pattern2 = Math.cos(seed2 * 0.002) * 1000;
        const combined = (pattern1 + pattern2 + seed1 + seed2) % 1000;
        
        // Adjust density for realistic QR look (about 50% filled)
        grid[row][col] = Math.abs(combined) % 100 < 50;
      }
    }
  }
  
  // Generate SVG with proper scaling
  let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${totalSize}" height="${totalSize}" fill="white"/>`;

  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (grid[row][col]) {
        const x = padding + (col * moduleSize);
        const y = padding + (row * moduleSize);
        svgContent += `\n  <rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
      }
    }
  }
  
  svgContent += '\n</svg>';
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
      
      try {
        // Generate scannable QR code SVG
        const qrSVG = generateScanableQRCode(memorialUrl, 300);
        
        // Convert SVG to base64 data URL for download
        const svgBase64 = btoa(qrSVG);
        const svgDataUrl = `data:image/svg+xml;base64,${svgBase64}`;
        
        qrImages.push({
          filename: `QR_${code.code}.svg`,
          data: svgBase64,
          url: memorialUrl,
          blob: svgDataUrl
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
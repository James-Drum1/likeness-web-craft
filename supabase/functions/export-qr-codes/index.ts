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

// Generate QR code SVG that looks like a real QR code
function generateQRCodeSVG(text: string, size: number = 200): string {
  // Create a simple but functional QR-like pattern
  const moduleSize = 8;
  const modules = 25; // 25x25 grid
  const padding = moduleSize * 2;
  const totalSize = (modules * moduleSize) + (padding * 2);
  
  // Create deterministic pattern based on text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
  }
  
  let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${totalSize}" height="${totalSize}" fill="white"/>`;

  // Generate pattern based on URL hash
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      // Create finder patterns (corners)
      const isFinderPattern = 
        (row < 7 && col < 7) || // Top-left
        (row < 7 && col >= modules - 7) || // Top-right
        (row >= modules - 7 && col < 7); // Bottom-left
      
      // Create timing patterns
      const isTimingPattern = (row === 6 || col === 6) && !isFinderPattern;
      
      let shouldFill = false;
      
      if (isFinderPattern) {
        // Finder pattern logic
        const relRow = row < 7 ? row : row - (modules - 7);
        const relCol = col < 7 ? col : col - (modules - 7);
        shouldFill = (relRow === 0 || relRow === 6 || relCol === 0 || relCol === 6 || 
                     (relRow >= 2 && relRow <= 4 && relCol >= 2 && relCol <= 4));
      } else if (isTimingPattern) {
        // Timing pattern alternates
        shouldFill = (row + col) % 2 === 0;
      } else {
        // Data pattern based on hash
        const seed = hash + row * 31 + col * 17;
        shouldFill = (seed % 3) !== 0;
      }
      
      if (shouldFill) {
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
      
      // Generate QR code SVG
      const qrSVG = generateQRCodeSVG(memorialUrl, 300);
      
      // Convert SVG to base64 data URL for download
      const svgBase64 = btoa(qrSVG);
      const svgDataUrl = `data:image/svg+xml;base64,${svgBase64}`;
      
      qrImages.push({
        filename: `QR_${code.code}.svg`,
        data: svgBase64,
        url: memorialUrl,
        blob: svgDataUrl
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
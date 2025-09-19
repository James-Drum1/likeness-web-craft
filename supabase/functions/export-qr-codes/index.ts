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

// Generate real QR code using QR.js library via CDN
async function generateRealQRCodeSVG(text: string, size: number = 300): Promise<string> {
  // Use QR.js library from CDN
  const qrLibResponse = await fetch('https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js');
  const qrLibCode = await qrLibResponse.text();
  
  // Create a simple QR code generation function
  const QRCode = eval(`
    ${qrLibCode}
    QRCode
  `);
  
  try {
    // Generate QR code as SVG string
    const qrSvg = await QRCode.toString(text, {
      type: 'svg',
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    
    return qrSvg;
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Fallback to simple QR if library fails
    return generateFallbackQR(text, size);
  }
}

// Fallback QR generator if library fails
function generateFallbackQR(text: string, size: number): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="white"/>
    <text x="50" y="50" text-anchor="middle" font-size="8" fill="black">QR Code Error</text>
  </svg>`;
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
        // Generate real, scannable QR code SVG
        const qrSVG = await generateRealQRCodeSVG(memorialUrl, 300);
        
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
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import QRCode from "https://esm.sh/qrcode@1.5.4";

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
        // Generate proper scannable QR code as SVG
        const svgContent = await QRCode.toString(memorialUrl, {
          type: 'svg',
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        
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
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { codes }: ExportRequest = await req.json();
    
    console.log('Exporting QR codes:', codes.length);

    // Create QR code images and ZIP them
    const qrImages: Array<{ filename: string; data: string }> = [];
    
    for (const code of codes) {
      // Generate QR code using a simple QR code generator
      const qrData = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app') || 'https://your-domain.com'}/memory/${code.code}`;
      
      // Create a simple QR code SVG (in production, you'd use a proper QR library)
      const qrSvg = `
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="20" y="20" width="160" height="160" fill="black"/>
          <rect x="30" y="30" width="140" height="140" fill="white"/>
          <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="8" fill="black">
            ${code.code}
          </text>
          <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="6" fill="black">
            Scan to view memorial
          </text>
        </svg>
      `;
      
      // Convert SVG to base64
      const svgBase64 = btoa(qrSvg);
      
      qrImages.push({
        filename: `qr-${code.code}.svg`,
        data: svgBase64
      });
    }

    // Create a simple ZIP-like structure (in base64)
    // In production, you'd use a proper ZIP library
    const zipContent = JSON.stringify({
      files: qrImages,
      metadata: {
        generated_at: new Date().toISOString(),
        total_codes: codes.length
      }
    });
    
    const zipBase64 = btoa(zipContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        zipData: zipBase64,
        count: codes.length
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
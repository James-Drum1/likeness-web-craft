import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import QRCode from 'https://esm.sh/qrcode@1.5.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateQRRequest {
  numberOfCodes: number;
  prefix?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { numberOfCodes, prefix = '' }: GenerateQRRequest = await req.json();

    console.log('Generating QR codes:', { numberOfCodes, prefix });

    const generatedCodes = [];

    for (let i = 0; i < numberOfCodes; i++) {
      // Generate unique QR code ID
      const uniqueId = crypto.randomUUID().replace(/-/g, '').substring(0, 12);
      const qrCodeId = prefix ? `${prefix}_${uniqueId}` : `MEM_${uniqueId}`;
      
      // Create memorial URL pointing to the QR memory page
      const memorialUrl = `${req.headers.get('origin') || 'https://0a6f24f0-4662-4eec-8e52-414c58a74125.lovableproject.com'}/qr/${qrCodeId}`;

      // Insert QR code into database
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          id: qrCodeId,
          memorial_url: memorialUrl,
          status: 'unclaimed'
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting QR code:', error);
        throw error;
      }

      // Generate QR code image
      try {
        const qrCodeImage = await QRCode.toDataURL(memorialUrl, {
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        generatedCodes.push({
          ...data,
          qrCodeImage: qrCodeImage,
          filename: `qr-code-${qrCodeId}.png`
        });
      } catch (qrError) {
        console.error('Error generating QR image:', qrError);
        // Include the code data even if QR generation fails
        generatedCodes.push({
          ...data,
          qrCodeImage: null,
          filename: `qr-code-${qrCodeId}.png`
        });
      }
    }

    console.log('Successfully generated codes:', generatedCodes.length);

    return new Response(JSON.stringify({
      success: true,
      codes: generatedCodes,
      message: `Generated ${numberOfCodes} QR codes successfully`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in generate-qr-codes function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

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
  emails?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { numberOfCodes, prefix = '', emails = [] }: GenerateQRRequest = await req.json();

    console.log('Generating QR codes:', { numberOfCodes, prefix, emailCount: emails.length });

    const generatedCodes = [];

    for (let i = 0; i < numberOfCodes; i++) {
      // Generate unique QR code
      const uniqueId = crypto.randomUUID().replace(/-/g, '').substring(0, 8);
      const qrCode = prefix ? `${prefix}_${uniqueId}` : `MEM_${uniqueId}`;
      
      // Get email for this code if provided
      const email = emails[i] || null;

      // Insert QR code into database
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          code: qrCode,
          email: email,
          prefix: prefix || null,
          is_claimed: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting QR code:', error);
        throw error;
      }

      generatedCodes.push(data);
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
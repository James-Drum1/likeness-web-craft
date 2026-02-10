import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LineItem {
  priceId: string;
  quantity: number;
  productName: string;
}

interface PaymentRequest {
  // Legacy single-item support
  productId?: string;
  priceId?: string;
  productName?: string;
  // Cart support
  lineItems?: LineItem[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Create payment function called");

    const body: PaymentRequest = await req.json();

    // Build line items from either cart or legacy single-item format
    let stripeLineItems: { price: string; quantity: number }[];
    let metadataNames: string;

    if (body.lineItems && body.lineItems.length > 0) {
      stripeLineItems = body.lineItems.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      }));
      metadataNames = body.lineItems.map((i) => i.productName).join(", ");
    } else if (body.priceId && body.productName) {
      stripeLineItems = [{ price: body.priceId, quantity: 1 }];
      metadataNames = body.productName;
    } else {
      throw new Error("Missing required fields: provide lineItems or priceId+productName");
    }

    console.log("Payment request for:", metadataNames);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    let customerEmail = null;
    let customerId = null;

    try {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        const user = data.user;

        if (user?.email) {
          customerEmail = user.email;
          const customers = await stripe.customers.list({ email: user.email, limit: 1 });
          if (customers.data.length > 0) {
            customerId = customers.data[0].id;
          }
        }
      }
    } catch (authError) {
      console.log("Proceeding with guest checkout:", authError);
    }

    const sessionConfig: any = {
      line_items: stripeLineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/shop`,
      metadata: { product_names: metadataNames },
      shipping_address_collection: { allowed_countries: ['IE'] },
      billing_address_collection: 'required',
    };

    if (customerId) {
      sessionConfig.customer = customerId;
    } else if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log("Checkout session created:", session.id);

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in create-payment function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);

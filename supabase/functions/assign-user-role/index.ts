import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with service role permissions
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create client for the requesting user
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Set the auth header for the user client
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (userError || !user) {
      throw new Error('Invalid user token')
    }

    console.log('User authenticated:', user.id)

    const { targetUserId, newRole } = await req.json()
    
    if (!targetUserId || !newRole) {
      throw new Error('Missing targetUserId or newRole')
    }

    console.log('Assigning role:', newRole, 'to user:', targetUserId)

    // Use the database function to update user role
    const { error: updateError } = await supabaseAdmin.rpc('update_user_role', {
      target_user_id: targetUserId,
      new_role: newRole
    })

    if (updateError) {
      console.error('Error updating user role:', updateError)
      throw updateError
    }

    // Also update the auth user metadata for immediate availability
    const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      {
        user_metadata: { user_type: newRole }
      }
    )

    if (metadataError) {
      console.error('Error updating user metadata:', metadataError)
      // Don't throw here as the main update succeeded
    }

    console.log('Role assignment completed successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Role updated successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in assign-user-role function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
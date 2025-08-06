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
    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('No authorization header')
    }

    // Create Supabase client with service role for admin operations
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

    // Verify user authentication and get user data
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      console.error('Invalid user token:', userError)
      throw new Error('Invalid user token')
    }

    console.log('User authenticated:', user.id)

    // Check if the authenticated user is an admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('user_type')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('Could not find user profile:', profileError)
      throw new Error('User profile not found')
    }

    if (profile.user_type !== 'admin') {
      console.error('User is not an admin:', profile.user_type)
      throw new Error('Only admins can assign roles')
    }

    console.log('Admin user verified')

    const { targetUserId, newRole } = await req.json()
    
    if (!targetUserId || !newRole) {
      console.error('Missing required parameters:', { targetUserId, newRole })
      throw new Error('Missing targetUserId or newRole')
    }

    console.log('Assigning role:', newRole, 'to user:', targetUserId)

    // Use the database function to update user role with admin context
    const { data, error: updateError } = await supabaseAdmin.rpc('update_user_role', {
      target_user_id: targetUserId,
      new_role: newRole
    }, {
      count: 'exact'
    })

    if (updateError) {
      console.error('Error updating user role:', updateError)
      throw new Error(`Failed to update user role: ${updateError.message}`)
    }

    console.log('Database function executed successfully')

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
      JSON.stringify({ 
        success: true, 
        message: 'Role updated successfully',
        targetUserId,
        newRole
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in assign-user-role function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.details || 'No additional details available'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
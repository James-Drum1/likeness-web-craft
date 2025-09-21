import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Create admin client with service role key for user management
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { email, password, fullName, userType } = await req.json()

    // Validate input
    if (!email || !password || !userType) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and user type are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!['admin', 'user'].includes(userType)) {
      return new Response(
        JSON.stringify({ error: 'User type must be either admin or user' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Creating ${userType} user: ${email}`)

    // First, check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers.users.find(user => user.email === email)

    let userId: string
    let isNewUser = false

    if (existingUser) {
      console.log(`User already exists: ${existingUser.id}`)
      userId = existingUser.id

      // Update existing user's metadata and password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          password: password, // Set the new password
          user_metadata: {
            ...existingUser.user_metadata,
            full_name: fullName || existingUser.user_metadata?.full_name || 'User',
            user_type: userType
          }
        }
      )

      if (updateError) {
        console.error('Error updating user metadata:', updateError)
        return new Response(
          JSON.stringify({ error: `Failed to update user: ${updateError.message}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    } else {
      // Create new user
      console.log(`Creating new ${userType} user: ${email}`)
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          full_name: fullName || 'User',
          user_type: userType
        },
        email_confirm: true
      })

      if (authError) {
        console.error('Auth error:', authError)
        return new Response(
          JSON.stringify({ error: `Failed to create user: ${authError.message}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      userId = authUser.user.id
      isNewUser = true
      console.log(`Auth user created successfully: ${userId}`)
    }

    // Handle profile creation/update
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (existingProfile) {
      // Update existing profile
      console.log(`Updating existing profile to ${userType}`)
      const { error: updateProfileError } = await supabaseAdmin
        .from('profiles')
        .update({
          role: userType,
          email: email,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateProfileError) {
        console.error('Profile update error:', updateProfileError)
        return new Response(
          JSON.stringify({ error: `Failed to update profile: ${updateProfileError.message}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    } else {
      // Create new profile
      console.log('Creating new profile')
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          role: userType
        })

      if (profileError) {
        console.error('Profile error:', profileError)
        // Clean up auth user if we just created it
        if (isNewUser) {
          await supabaseAdmin.auth.admin.deleteUser(userId)
        }
        
        return new Response(
          JSON.stringify({ error: `Failed to create profile: ${profileError.message}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    console.log('Profile processed successfully')

    // Log admin activity
    try {
      await supabaseAdmin
        .from('admin_activity_logs')
        .insert({
          admin_user_id: userId, // Will be replaced with actual admin user id from auth
          action: isNewUser ? `create_${userType}_user` : `upgrade_to_${userType}`,
          target_type: 'user',
          target_id: userId,
          details: { 
            email, 
            userType,
            created_via: 'admin_dashboard', 
            was_existing_user: !isNewUser 
          }
        })
    } catch (logError) {
      console.error('Failed to log admin activity:', logError)
      // Don't fail the whole operation for logging errors
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: isNewUser ? `${userType} user created successfully` : `User upgraded to ${userType} successfully`,
        user_id: userId,
        email: email,
        user_type: userType,
        was_existing_user: !isNewUser
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
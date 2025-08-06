-- Create user_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('customer', 'worker', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ensure the profiles table uses the correct user_type
ALTER TABLE profiles ALTER COLUMN user_type TYPE user_type USING user_type::text::user_type;

-- Recreate the update_user_role function with proper error handling
CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role user_type)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND user_type = 'admin'::user_type
  ) THEN
    RAISE EXCEPTION 'Only admins can assign roles';
  END IF;

  -- Update the user's role in profiles table
  UPDATE public.profiles 
  SET user_type = new_role, updated_at = now()
  WHERE user_id = target_user_id;

  -- If changing to worker, create worker portfolio if it doesn't exist
  IF new_role = 'worker'::user_type THEN
    INSERT INTO public.worker_portfolios (
      user_id, 
      business_name, 
      email, 
      phone, 
      location, 
      status
    ) 
    SELECT 
      target_user_id,
      'Business Name',
      COALESCE((SELECT email FROM auth.users WHERE id = target_user_id), 'email@example.com'),
      '000-000-0000',
      'Ireland',
      'pending'::worker_status
    WHERE NOT EXISTS (
      SELECT 1 FROM public.worker_portfolios WHERE user_id = target_user_id
    );
  END IF;

  -- Log the admin activity
  INSERT INTO public.admin_activity_logs (
    admin_user_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    auth.uid(),
    'role_assignment',
    'user',
    target_user_id,
    jsonb_build_object('new_role', new_role, 'timestamp', now())
  );
END;
$function$;
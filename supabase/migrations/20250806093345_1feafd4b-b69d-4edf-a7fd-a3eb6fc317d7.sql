-- Update user_type enum to change 'tradesperson' to 'worker'
-- First, add the new 'worker' enum value
ALTER TYPE public.user_type ADD VALUE 'worker';

-- Update existing records to use 'worker' instead of 'tradesperson'
UPDATE public.profiles SET user_type = 'worker'::user_type WHERE user_type = 'tradesperson'::user_type;

UPDATE public.worker_portfolios SET status = 'active'::worker_status 
WHERE user_id IN (
  SELECT user_id FROM public.profiles WHERE user_type = 'worker'::user_type
);

-- Create a function to assign user roles that updates both profiles and auth metadata
CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role user_type)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
      COALESCE(auth.email(), 'email@example.com'),
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
$$;
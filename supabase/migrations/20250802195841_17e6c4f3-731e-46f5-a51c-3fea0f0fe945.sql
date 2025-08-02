-- Create a security definer function to check if current user is admin
-- This prevents infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_type = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Add new RLS policy that allows admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR public.is_current_user_admin()
  );
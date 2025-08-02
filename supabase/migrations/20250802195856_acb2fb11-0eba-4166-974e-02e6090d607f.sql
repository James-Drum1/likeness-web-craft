-- Fix the function security issue by setting search_path
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_type = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';
-- Create user_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('customer', 'worker', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Temporarily drop policies that depend on user_type column
DROP POLICY IF EXISTS "Admins can manage all locations" ON public.locations;
DROP POLICY IF EXISTS "Admins can manage all service categories" ON public.service_categories;
DROP POLICY IF EXISTS "Only admins can manage settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Only admins can view activity logs" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update featured status" ON public.worker_portfolios;

-- Update the profiles table to use the correct user_type enum
ALTER TABLE profiles ALTER COLUMN user_type TYPE user_type USING user_type::text::user_type;

-- Recreate the policies
CREATE POLICY "Admins can manage all locations" 
ON public.locations 
FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND user_type = 'admin'::user_type
));

CREATE POLICY "Admins can manage all service categories" 
ON public.service_categories 
FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND user_type = 'admin'::user_type
));

CREATE POLICY "Only admins can manage settings" 
ON public.admin_settings 
FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND user_type = 'admin'::user_type
));

CREATE POLICY "Only admins can view activity logs" 
ON public.admin_activity_logs 
FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND user_type = 'admin'::user_type
));

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT
USING ((auth.uid() = user_id) OR is_current_user_admin());

CREATE POLICY "Admins can update featured status" 
ON public.worker_portfolios 
FOR UPDATE
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());
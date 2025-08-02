-- Update user_type enum to include admin
ALTER TYPE public.user_type ADD VALUE IF NOT EXISTS 'admin';

-- Create admin_settings table for global website configuration
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_settings (only admins can access)
CREATE POLICY "Only admins can manage settings" 
ON public.admin_settings 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND user_type = 'admin'
  )
);

-- Insert default admin settings
INSERT INTO public.admin_settings (setting_key, setting_value, description) VALUES
('site_name', 'WorkersMate', 'Website name'),
('site_description', 'Connecting trusted workers with customers across Ireland', 'Website description'),
('featured_workers_limit', '6', 'Number of featured workers to show'),
('review_moderation', 'false', 'Enable review moderation'),
('worker_approval_required', 'false', 'Require admin approval for new workers'),
('maintenance_mode', 'false', 'Enable maintenance mode')
ON CONFLICT (setting_key) DO NOTHING;

-- Create admin_activity_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT, -- 'worker', 'customer', 'review', 'setting', etc.
  target_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_activity_logs
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_activity_logs
CREATE POLICY "Only admins can view activity logs" 
ON public.admin_activity_logs 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND user_type = 'admin'
  )
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_user_id ON public.admin_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON public.admin_activity_logs(created_at);

-- Add trigger for updated_at on admin_settings
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
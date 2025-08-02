-- Create table for tracking profile views
CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID NOT NULL,
  viewer_ip TEXT,
  viewer_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profile_views
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Create policies for profile_views
CREATE POLICY "Anyone can create profile views" 
ON public.profile_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Workers can view their own profile views" 
ON public.profile_views 
FOR SELECT 
USING (
  worker_id IN (
    SELECT id FROM public.worker_portfolios 
    WHERE user_id = auth.uid()
  )
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profile_views_worker_id ON public.profile_views(worker_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_created_at ON public.profile_views(created_at);

-- Add foreign key constraint
DO $$ BEGIN
    ALTER TABLE public.profile_views 
    ADD CONSTRAINT fk_profile_views_worker_id 
    FOREIGN KEY (worker_id) REFERENCES public.worker_portfolios(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
-- Add is_featured column to worker_portfolios table
ALTER TABLE public.worker_portfolios 
ADD COLUMN is_featured boolean NOT NULL DEFAULT false;

-- Add index for better performance when querying featured workers
CREATE INDEX idx_worker_portfolios_featured ON public.worker_portfolios(is_featured) WHERE is_featured = true;

-- Create RLS policy for admins to update featured status
CREATE POLICY "Admins can update featured status" 
ON public.worker_portfolios 
FOR UPDATE 
USING (is_current_user_admin()) 
WITH CHECK (is_current_user_admin());
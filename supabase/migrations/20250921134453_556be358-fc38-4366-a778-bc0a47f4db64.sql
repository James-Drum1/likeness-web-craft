-- Fix QR codes RLS policy to allow public access to claimed QR codes
-- This is critical for anonymous users to view memorial pages via QR scans

-- Drop the restrictive policy that only allows unclaimed QR codes or owned QR codes
DROP POLICY IF EXISTS "Users can view and claim unclaimed QR codes" ON public.qr_codes;

-- Create new policy that allows everyone to view all QR codes
-- This enables memorial pages to be accessible to anonymous users
CREATE POLICY "Anyone can view QR codes" 
ON public.qr_codes 
FOR SELECT 
USING (true);

-- Keep the claiming policy for authenticated users only
-- This allows users to claim unclaimed QR codes
CREATE POLICY "Authenticated users can claim unclaimed QR codes" 
ON public.qr_codes 
FOR UPDATE 
USING (
  status = 'unclaimed' 
  AND auth.uid() IS NOT NULL
)
WITH CHECK (
  status = 'claimed' 
  AND claimed_by = auth.uid()
);

-- Ensure all existing memorials are public for proper access
UPDATE public.memorials 
SET is_public = true 
WHERE is_public IS NULL OR is_public = false;
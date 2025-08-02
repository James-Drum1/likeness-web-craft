-- Ensure storage policies exist for portfolio images
-- Create policy for workers to upload their own portfolio images
CREATE POLICY IF NOT EXISTS "Workers can upload portfolio images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'portfolio-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for workers to update their own portfolio images
CREATE POLICY IF NOT EXISTS "Workers can update portfolio images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'portfolio-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for workers to delete their own portfolio images
CREATE POLICY IF NOT EXISTS "Workers can delete portfolio images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'portfolio-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Public read access for portfolio images
CREATE POLICY IF NOT EXISTS "Portfolio images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'portfolio-images');
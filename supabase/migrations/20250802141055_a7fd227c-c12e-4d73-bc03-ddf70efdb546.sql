-- Create storage policies for portfolio images bucket
-- Drop existing policies first if they exist
DROP POLICY IF EXISTS "Workers can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Workers can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Workers can delete portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Portfolio images are publicly accessible" ON storage.objects;

-- Create policy for workers to upload their own portfolio images
CREATE POLICY "Workers can upload portfolio images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'portfolio-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for workers to update their own portfolio images
CREATE POLICY "Workers can update portfolio images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'portfolio-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for workers to delete their own portfolio images
CREATE POLICY "Workers can delete portfolio images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'portfolio-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Public read access for portfolio images
CREATE POLICY "Portfolio images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'portfolio-images');
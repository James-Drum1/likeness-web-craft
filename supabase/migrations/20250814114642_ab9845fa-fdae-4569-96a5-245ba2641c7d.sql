-- Remove the service_category enum constraint and use text instead
-- First, drop the existing enum type constraint
ALTER TABLE worker_services ALTER COLUMN category TYPE text;

-- Drop the enum type (this will work since we just changed the column to text)
DROP TYPE IF EXISTS service_category;

-- Update the BrowseWorkers logic to use service_categories table properly
-- Add an index for better performance on category searches
CREATE INDEX IF NOT EXISTS idx_worker_services_category ON worker_services(category);

-- Map existing enum values to proper display names from service_categories
-- This ensures data consistency
UPDATE worker_services 
SET category = CASE 
  WHEN category = 'plumbing' THEN 'Plumber'
  WHEN category = 'electrical' THEN 'Electrician' 
  WHEN category = 'carpentry' THEN 'Carpenter'
  WHEN category = 'painting' THEN 'Painter'
  WHEN category = 'roofing' THEN 'Roofer'
  WHEN category = 'cleaning' THEN 'Cleaner'
  WHEN category = 'gardening' THEN 'Gardener'
  WHEN category = 'handyman' THEN 'Handyman'
  WHEN category = 'moving' THEN 'Mover'
  WHEN category = 'hvac' THEN 'HVAC Technician'
  WHEN category = 'flooring' THEN 'Flooring Contractor'
  ELSE category
END
WHERE category IN ('plumbing', 'electrical', 'carpentry', 'painting', 'roofing', 'cleaning', 'gardening', 'handyman', 'moving', 'hvac', 'flooring');

-- Add a constraint to ensure category values match service_categories names
ALTER TABLE worker_services ADD CONSTRAINT fk_worker_services_category 
FOREIGN KEY (category) REFERENCES service_categories(name);
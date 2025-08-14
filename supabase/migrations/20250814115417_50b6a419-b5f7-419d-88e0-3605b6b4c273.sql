-- Complete the worker_services category migration

-- First, remove any existing foreign key constraints
DO $$ 
BEGIN
    -- Check if there are any foreign key constraints on worker_services.category and drop them
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%worker_services%category%' 
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE worker_services DROP CONSTRAINT IF EXISTS worker_services_category_fkey;
    END IF;
END $$;

-- Convert the category column from enum to text if it's still an enum
DO $$
BEGIN
    -- Check if the column is still using the enum type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'worker_services' 
        AND column_name = 'category' 
        AND udt_name = 'service_category'
    ) THEN
        -- Convert enum to text
        ALTER TABLE worker_services ALTER COLUMN category TYPE text USING category::text;
    END IF;
END $$;

-- Drop the old enum type if it still exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_category') THEN
        DROP TYPE service_category CASCADE;
    END IF;
END $$;

-- Update any remaining old enum values to match service_categories names
UPDATE worker_services 
SET category = CASE 
  WHEN category = 'flooring' THEN 'Flooring Contractor'
  WHEN category = 'plumbing' THEN 'Plumbing'
  WHEN category = 'electrical' THEN 'Electrical'
  WHEN category = 'carpentry' THEN 'Carpentry'
  WHEN category = 'painting' THEN 'Painting'
  WHEN category = 'roofing' THEN 'Roofing'
  WHEN category = 'cleaning' THEN 'Cleaning'
  WHEN category = 'gardening' THEN 'Gardening'
  WHEN category = 'handyman' THEN 'Handyman'
  WHEN category = 'moving' THEN 'Other'
  WHEN category = 'hvac' THEN 'Other'
  WHEN category = 'other' THEN 'Other'
  ELSE category
END
WHERE category IN ('flooring', 'plumbing', 'electrical', 'carpentry', 'painting', 'roofing', 'cleaning', 'gardening', 'handyman', 'moving', 'hvac', 'other');

-- Ensure we have all the basic service categories
INSERT INTO service_categories (name, description, is_active) VALUES 
  ('Plumbing', 'Plumbing services and repairs', true),
  ('Electrical', 'Electrical work and repairs', true),
  ('Carpentry', 'Carpentry and woodworking services', true),
  ('Painting', 'Painting and decorating services', true),
  ('Roofing', 'Roofing services and repairs', true),
  ('Cleaning', 'Cleaning services', true),
  ('Gardening', 'Gardening and landscaping services', true),
  ('Handyman', 'General handyman services', true),
  ('Other', 'Other services not listed', true)
ON CONFLICT (name) DO NOTHING;

-- Add foreign key constraint to ensure data integrity
ALTER TABLE worker_services 
ADD CONSTRAINT worker_services_category_fkey 
FOREIGN KEY (category) REFERENCES service_categories(name) ON UPDATE CASCADE;
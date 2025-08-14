-- Fix the existing services that weren't updated properly
UPDATE worker_services 
SET category = 'Flooring Contractor'
WHERE category = 'flooring';

-- Also ensure we handle other old enum values that might exist
UPDATE worker_services 
SET category = CASE 
  WHEN category = 'plumbing' THEN 'plumbing'
  WHEN category = 'electrical' THEN 'electrical' 
  WHEN category = 'carpentry' THEN 'carpentry'
  WHEN category = 'painting' THEN 'painting'
  WHEN category = 'roofing' THEN 'roofing'
  WHEN category = 'cleaning' THEN 'cleaning'
  WHEN category = 'gardening' THEN 'gardening'
  WHEN category = 'handyman' THEN 'handyman'
  WHEN category = 'moving' THEN 'Other'
  WHEN category = 'hvac' THEN 'Other'
  WHEN category = 'flooring' THEN 'Flooring Contractor'
  ELSE category
END
WHERE category IN ('plumbing', 'electrical', 'carpentry', 'painting', 'roofing', 'cleaning', 'gardening', 'handyman', 'moving', 'hvac', 'flooring');

-- Add 'Other' category if it doesn't exist
INSERT INTO service_categories (name, description, is_active)
VALUES ('Other', 'Other services not listed', true)
ON CONFLICT (name) DO NOTHING;
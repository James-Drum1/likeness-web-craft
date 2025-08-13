-- First, let's see what service categories exist in the database that need mapping
-- and update the worker_services table to use proper enum values

-- Map display names to enum values for existing services
UPDATE public.worker_services 
SET category = CASE 
  WHEN category ILIKE '%flooring%' OR category ILIKE '%floor%' THEN 'flooring'::service_category
  WHEN category ILIKE '%electrical%' OR category ILIKE '%electric%' THEN 'electrical'::service_category
  WHEN category ILIKE '%plumbing%' OR category ILIKE '%plumber%' THEN 'plumbing'::service_category
  WHEN category ILIKE '%carpentry%' OR category ILIKE '%carpenter%' THEN 'carpentry'::service_category
  WHEN category ILIKE '%painting%' OR category ILIKE '%paint%' THEN 'painting'::service_category
  WHEN category ILIKE '%roofing%' OR category ILIKE '%roof%' THEN 'roofing'::service_category
  WHEN category ILIKE '%gardening%' OR category ILIKE '%garden%' OR category ILIKE '%landscaping%' THEN 'gardening'::service_category
  WHEN category ILIKE '%cleaning%' OR category ILIKE '%clean%' THEN 'cleaning'::service_category
  WHEN category ILIKE '%hvac%' OR category ILIKE '%heating%' OR category ILIKE '%cooling%' THEN 'hvac'::service_category
  WHEN category ILIKE '%handyman%' OR category ILIKE '%maintenance%' THEN 'handyman'::service_category
  ELSE 'other'::service_category
END
WHERE category NOT IN ('flooring', 'electrical', 'plumbing', 'carpentry', 'painting', 'roofing', 'gardening', 'cleaning', 'hvac', 'handyman', 'other');

-- Create a mapping function to convert display names to enum values
CREATE OR REPLACE FUNCTION public.map_category_name_to_enum(category_name text)
RETURNS service_category
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN CASE 
    WHEN category_name ILIKE '%flooring%' OR category_name ILIKE '%floor%' THEN 'flooring'::service_category
    WHEN category_name ILIKE '%electrical%' OR category_name ILIKE '%electric%' THEN 'electrical'::service_category
    WHEN category_name ILIKE '%plumbing%' OR category_name ILIKE '%plumber%' THEN 'plumbing'::service_category
    WHEN category_name ILIKE '%carpentry%' OR category_name ILIKE '%carpenter%' THEN 'carpentry'::service_category
    WHEN category_name ILIKE '%painting%' OR category_name ILIKE '%paint%' THEN 'painting'::service_category
    WHEN category_name ILIKE '%roofing%' OR category_name ILIKE '%roof%' THEN 'roofing'::service_category
    WHEN category_name ILIKE '%gardening%' OR category_name ILIKE '%garden%' OR category_name ILIKE '%landscaping%' THEN 'gardening'::service_category
    WHEN category_name ILIKE '%cleaning%' OR category_name ILIKE '%clean%' THEN 'cleaning'::service_category
    WHEN category_name ILIKE '%hvac%' OR category_name ILIKE '%heating%' OR category_name ILIKE '%cooling%' THEN 'hvac'::service_category
    WHEN category_name ILIKE '%handyman%' OR category_name ILIKE '%maintenance%' THEN 'handyman'::service_category
    ELSE 'other'::service_category
  END;
END;
$$;
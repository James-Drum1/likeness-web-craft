-- Update existing services that were incorrectly categorized
UPDATE worker_services 
SET category = 'flooring'::service_category
WHERE service_name ILIKE '%flooring%' 
  AND category != 'flooring'::service_category;
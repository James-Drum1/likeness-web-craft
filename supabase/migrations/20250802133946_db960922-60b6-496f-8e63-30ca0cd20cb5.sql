-- Create missing enum types
CREATE TYPE public.user_type AS ENUM ('customer', 'tradesperson');
CREATE TYPE public.worker_status AS ENUM ('pending', 'active', 'inactive', 'suspended');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE public.service_category AS ENUM (
  'plumbing', 
  'electrical', 
  'carpentry', 
  'painting', 
  'roofing', 
  'gardening', 
  'cleaning', 
  'heating', 
  'construction', 
  'renovation',
  'landscaping',
  'tiling',
  'flooring',
  'plastering',
  'glazing',
  'security',
  'appliance_repair',
  'handyman',
  'other'
);